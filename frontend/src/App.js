import {useState} from "react";
import "./styles.css"
import {Alert, Snackbar} from "@mui/material";
import {sendPicture, sendLabeledPicture} from "./Services/ImageService"
import PredictionTable from "./Components/PredictionTable"
import DrawingBoard from "./Components/DrawingBoard"
import FeedbackDialog from "./Components/FeedbackDialog";

export default function App() {

const [picture, setPicture] = useState(null)
const [prediction, setPrediction] = useState(new Array(10).fill(0))
const [label, setLabel] = useState(null)
const [loading, setLoading] = useState(false)
const [evaluateButtonEnabled, setEvaluateButtonEnabled] = useState(false)
const [dialogState, setDialogState] = useState({
  verifyButtonEnabled: false,
  textfieldDisplay: "none",
  dialogOpen: false,
  yesChecked: false,
  noChecked: false,
})
const [alertState, setAlertState] = useState({
  alertOpen: false,
  alertColor: "success",
  alertText: ""
})

const onAlertClose = (event, reason) => {
  if (reason === 'clickaway') {
      return;
  }
  setAlertState({...alertState, alertOpen: false})
}

const onDialogClose = (event) => {
  setDialogState({
    verifyButtonEnabled: false,
    textfieldDisplay: "none",
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
  setDialogState({...dialogState, verifyButtonEnabled: true, textfieldDisplay: "none", yesChecked: true, noChecked: false})
}

const onNoClick = (event) => {
  setDialogState({...dialogState, textfieldEnabled: true, textfieldDisplay: "block", yesChecked: false, noChecked: true})
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
  if (response) {
    if (response.status === 200) {
      console.log(response.data)
      setAlertState({...alertState, alertOpen: true,
        alertText: "Image has been verified and added to the training dataset!", 
        alertColor: "success"})
      onDialogClose()
      setEvaluateButtonEnabled(false)
    }
    else {

    }
  } else {

  }
}

const onPredictButtonClick = async (event) => {
    event.preventDefault()
    setLoading(true)
    if (!picture) {
      setAlertState({...alertState, alertOpen: true,
        alertText: "Please draw a digit [0-9] first",
        alertColor: "error"})
      return
    }
    const response = await sendPicture(picture)
    if (response) {
      if (response.status === 200) {
          setPrediction(response.data)
          setEvaluateButtonEnabled(true)
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
        <DrawingBoard 
          onPredictButtonClick={onPredictButtonClick}
          setPicture={setPicture} 
          onDialogOpen={onDialogOpen}
          evaluateButtonEnabled={evaluateButtonEnabled}
          setEvaluateButtonEnabled={setEvaluateButtonEnabled}
        />
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
        {
          <Snackbar open={alertState.alertOpen}
            autoHideDuration={5000}
            onClose={onAlertClose} 
            anchorOrigin={{ vertical: "top", horizontal: "center"}}
            sx={{whiteSpace: "nowrap"}}
          >
            <Alert variant={"filled"} onClose={onAlertClose} severity={alertState.alertColor}>
              {alertState.alertText}
            </Alert>
          </Snackbar> 
        }
    </div>
  )
}