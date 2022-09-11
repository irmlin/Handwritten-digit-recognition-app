import CanvasDraw from "react-canvas-draw";
import {useState, useRef} from "react";
import {Button} from "@mui/material";
import "./styles.css"
import {sendPicture} from "./Services/ImageService"
import { Buffer } from "buffer";
import PredictionTable from "./Components/PredictionTable"
export default function App() {

const canvasRef = useRef(null)
const [picture, setPicture] = useState(null)
const [prediction, setPrediction] = useState(new Array(10).fill(0))
const [loading, setLoading] = useState(false)

function updateDrawing() {
  const base64 = canvasRef.current.canvasContainer.childNodes[1].toDataURL().split(',')[1]
  const bytes = Buffer.from(base64, "base64")
  setPicture(bytes)
}

const onCanvasChange = (event) => {
    updateDrawing()
  };

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
          // setSnackText("Updated successfully!");
          // setSnackColor("success");
          // setSnackOpen(true);
          // setEditingMode(false);
      } else {
          setPrediction([])
          // setSnackColor("error");
          // setSnackText("Update failed")
      }
  } else {
      // setSnackColor("error");
      // setSnackText("A server error has occurred.");
  }
}

const onClearButtonClick = (event) => {
  canvasRef.current.clear()
  setPicture(null)
}

const onUndoButtonClick = (event) => {
  canvasRef.current.undo()
  if(!canvasRef.current.lines.length) {
    setPicture(null)
  } else {
    updateDrawing()
  }
}

  return (
    <div className={"content"}>
      <div>
        <CanvasDraw
                ref={canvasRef}
                className={"canvas"}
                hideGrid={true}
                brushRadius={10}
                brushColor={"black"}
                onChange={onCanvasChange}
              />
        <div style={{display:"flex", marginBottom:8}}>
          <Button style={{width:"32.5%"}} color={"success"} variant={"contained"} onClick={onPredictButtonClick}>
            <b>Predict</b>
          </Button>

          <Button style={{width:"35.0%"}} color={"error"} variant={"contained"} onClick={onClearButtonClick}>
          <b>Clear Image</b>
          </Button>

          <Button style={{width:"32.5%"}} variant={"contained"} onClick={onUndoButtonClick}>
          <b>Undo</b>
          </Button>
        </div>
      </div>
      <PredictionTable prediction={prediction} loading={loading}/>
    </div>
  )
}