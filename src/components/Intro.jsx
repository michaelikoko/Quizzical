import Footer from "./Footer"

export default function Intro(props) {

    return (
        <div>
            <section className="intro">
                <h1 className="intro-heading">Quizzical</h1>
                <p className="intro-text mt-4">Test your General Knowledge skills</p>
                <button className="intro-button" onClick={props.handleClick}>Start quiz</button>
            </section>

            <div className="fixed-bottom">
                <Footer />
            </div>
        </div>
    )
}