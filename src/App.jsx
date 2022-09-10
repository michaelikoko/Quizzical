import React from "react"
import Footer from "./components/Footer"
import Intro from "./components/Intro"
import Quiz from "./components/Quiz"
import "./style.css"

export default function App() {
    const [startQuiz, setStartQuiz] = React.useState(false) //Displays the intro page if false
    const [loading, setLoading] = React.useState(false)
    const [networkError, setNetworkError] = React.useState(false)

    function play() {
        /*When the user clicks the start game button in the intro page */

        setStartQuiz(true)
        createQuizObj()
    }

    function shuffle(array) {
        /*Schwartzian transform */
        /*Shuffles an array */
        let unshuffled = array.slice()
        let shuffled = unshuffled
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
        return shuffled
    }
    const [checkAnswer, setCheckAnswer] = React.useState(false) //Displays the answers and score if set to true

    const [data, setData] = React.useState() //Stores the data gotten from the API call
    React.useEffect(() => {
        /*fetch("https://opentdb.com/api.php?amount=10&category=9&type=multiple")
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setData(data.results)
        })*/
        async function getData() {
            try {
                setLoading(true)
                const res = await fetch("https://opentdb.com/api.php?amount=10&category=9&type=multiple")
                const data = await res.json()
                console.log('data', data)
                setData(data.results)
                setLoading(false)
            }
            catch (error) {
                //if (error.name === 'TypeError') setNetworkError(true)
                setNetworkError(true)
            }
        }
        getData()

    }, [checkAnswer]) //The API call to OTDB, reruns when checkAnswer changes

    const [quizObj, setQuizObj] = React.useState(
        [{
            userAnswer: "",
            correctAnswer: "",
            question: "",
            options: []
        }]
    ) //Custom made array of objects. Each object represents information about each question

    function createQuizObj() {
        /*Creates the quizObj from the data gotten from the API call*/
        if (!loading) {
            console.log('creating quizObj')
            setQuizObj(data.map(dataObj => {
                return {
                    userAnswer: "",
                    correctAnswer: dataObj.correct_answer,
                    question: dataObj.question,
                    options: shuffle([...dataObj.incorrect_answers, dataObj.correct_answer])
                }
            }))
        }

    }

    function selectAnswer(objIndex, selectedOption) {
        /*Changes the userAnswer property of the object located in the objIndex parameter value, to the selectedOption */
        setQuizObj(prevQuizObj => (
            prevQuizObj.map((obj, index) => {
                if (index === objIndex) return { ...obj, userAnswer: selectedOption }
                return { ...obj }
            })
        ))
    }

    function answeredAll() {
        for (let obj of quizObj) {
            if (obj.userAnswer === "") return false;
        }
        return true
    }

    const [score, setScore] = React.useState(0) //Stores the score

    function handleCheckAnswer() {
        /*When the user clicks the check answer button */
        let scoreCount = 0
        for (let obj of quizObj) {
            if (obj.correctAnswer === obj.userAnswer) {
                scoreCount++
                console.log(obj.correctAnswer, obj.userAnswer)
            }
        }
        console.log(scoreCount)
        setScore(scoreCount)
        setCheckAnswer(true)
    }

    function playAgain() {
        /*When the user clicks the play again button. It resets the score, checkAnswer and creates a new quizObj  */
        setScore(0)
        setCheckAnswer(oldValue => !oldValue)
        createQuizObj()
    }

    const quizElements = quizObj.map((obj, index) => {
        return <Quiz
            quizObjData={obj}
            key={index}
            handleClick={selectAnswer}
            objIndex={index}
            checkAnswer={checkAnswer}
        />
    }) //Array of Quiz elements where each Quiz element is a question

    if (loading && !networkError) {
        return (
            <main>
                <div className="quiz">
                    <div className="loader"></div>
                </div>
            </main>
        )
    }
    else if (networkError) {
        return (
            <main>
                <div className="quiz">
                    <h1
                        className="intro-heading"
                        style={{ alignSelf: 'center' }}
                    >
                        Connection Error
                    </h1>

                    <p className="intro-text">Check your internent connection and try again</p>

                    <button
                        className="intro-button" onClick={() => { window.location.reload(false) }}
                        style={{ alignSelf: 'center' }}
                    >
                        Try again
                    </button>
                </div>
            </main>
        )
    }
    else {
        return (
            <main>
                {
                    startQuiz ?
                        <div>
                            <div className="quiz">
                                {quizElements}
                                {checkAnswer && <p className="score">You scored {score}/{quizElements.length} </p>}
                                {
                                    answeredAll() ?
                                        <button className="quiz-button" onClick={checkAnswer ? playAgain : handleCheckAnswer}>
                                            {checkAnswer ? "Play again" : "Check answer"}
                                        </button> :
                                        <button className="quiz-button-disabled" disabled>Check answer</button>
                                }
                            </div>
                            <div style={{width: "100vw"}}>
                                <Footer />
                            </div>
                        </div>
                        :
                        <Intro handleClick={play} />
                }
            </main>
        )
    }
}