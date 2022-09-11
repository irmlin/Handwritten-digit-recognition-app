import {useState} from "react";
import "./styles.css"
import {sendPicture} from "./Services/ImageService"
import PredictionTable from "./Components/PredictionTable"
import DrawingBoard from "./Components/DrawingBoard"
import FeedbackSection from "./Components/FeedbackSection";

export default function App() {

const [picture, setPicture] = useState(null)
const [prediction, setPrediction] = useState(new Array(10).fill(0))
const [loading, setLoading] = useState(false)

const onPredictButtonClick = async (event) => {
    event.preventDefault()
    setLoading(true)
    if (!picture) {
      console.log("Please write a digit first.")
      return
    }
    const response = await sendPicture(picture)
    if (response) {
      if (response.status === 200) {
          setPrediction(response.data)
          setLoading(false)
      } else {
          setPrediction(new Array(10).fill(0))
      }
  } else {

  }
}

  return (
    <div className={"content"}>
      <div style={{display: "flex"}}>
        <DrawingBoard onPredictButtonClick={onPredictButtonClick} setPicture={setPicture}/>
        <PredictionTable prediction={prediction} loading={loading}/>
      </div>
      <FeedbackSection/>
    </div>
  )
}