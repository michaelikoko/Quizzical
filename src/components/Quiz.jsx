import React from "react"

export default function Quiz(props)
{
    const {quizObjData} = props

    const optionElements = quizObjData.options.map((option,index) => {
        if (!props.checkAnswer)
        {
            return (
                <button
                    className={quizObjData.userAnswer === option ?  "clicked-option" : "quiz-option"} 
                    key={index}
                    onClick={() => props.handleClick(props.objIndex, option)}
                    dangerouslySetInnerHTML={{__html: option}}
                />
            )
        }
        else 
        {
            let styles = {}
            if (option === quizObjData.correctAnswer)
            {
                styles["backgroundColor"] = "#94d7a2"
                styles["border"] = "none"
            }
            if (option === quizObjData.userAnswer && option !== quizObjData.correctAnswer)
            {
                styles["backgroundColor"] = "#f8bcbc"
                styles["border"] = "none"
            }
            return (
                <button
                    key={index}
                    style={styles}
                    className="quiz-option"
                    dangerouslySetInnerHTML={{__html: option}}
                />
            )
        }
    })

    return (
        <div className="quiz-item">
            <p dangerouslySetInnerHTML={{__html: quizObjData.question}} className="quiz-question" />
            <div className="quiz-options">
                {optionElements}
            </div>
        </div>
    )
}