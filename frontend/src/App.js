import {useState} from "react";
import "./styles.css"
import {Button} from "@mui/material";
import {sendPicture, sendLabeledPicture} from "./Services/ImageService"
import PredictionTable from "./Components/PredictionTable"
import DrawingBoard from "./Components/DrawingBoard"
import FeedbackDialog from "./Components/FeedbackDialog";

export default function App() {

const [picture, setPicture] = useState(null)
const [prediction, setPrediction] = useState(new Array(10).fill(0))
const [label, setLabel] = useState(null)
const [loading, setLoading] = useState(false)
const [dialogState, setDialogState] = useState({
  verifyButtonEnabled: false,
  textfieldEnabled: false,
  dialogOpen: false,
  yesChecked: false,
  noChecked: false
})

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

const onDialogClose = (event) => {
  setDialogState({
    verifyButtonEnabled: false,
    textfieldVisible: false,
    dialogOpen: false,
    noChecked: false,
    yesChecked: false
  })
}

const onDialogOpen = (event) => {
  setDialogState({...dialogState, dialogOpen: true})
}

const onYesClick = async (event) => {
  setLabel(prediction.indexOf(Math.max(...prediction)))
  setDialogState({...dialogState, verifyButtonEnabled: true, textfieldEnabled: false, yesChecked: true, noChecked: false})
}

const onNoClick = (event) => {
  setDialogState({...dialogState, textfieldEnabled: true, verifyButtonEnabled: false, yesChecked: false, noChecked: true})
}

const onTextfieldChange = (event) => {
  const val = Number(event.target.value)
  setLabel(val)
  if (val < 0 || val > 9) {
    setDialogState({...dialogState, verifyButtonEnabled: false})
  } else {
    setDialogState({...dialogState, verifyButtonEnabled: true})
  }
}

const onVerifyButtonClick = async (event) => {
  event.preventDefault();

  const response = await sendLabeledPicture(picture, label)
  console.log(response)
}

  return (
    <div className={"content"}>
      <div style={{display: "flex"}}>
        <DrawingBoard onPredictButtonClick={onPredictButtonClick} setPicture={setPicture}/>
        <PredictionTable prediction={prediction} loading={loading}/>
      </div>
      <FeedbackDialog
        onDialogClose={onDialogClose}
        onTextfieldChange={onTextfieldChange}
        onVerifyButtonClick={onVerifyButtonClick}
        onYesClick={onYesClick}
        onNoClick={onNoClick}
        dialogState={dialogState}
        label={label}
        />
        <Button variant={"contained"} onClick={onDialogOpen}>
          Evalutate Prediction
        </Button>
    </div>
  )
}