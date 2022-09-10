import CanvasDraw from "react-canvas-draw";
import {useState, useRef} from "react";
import {Button} from "@mui/material";
import "./styles.css"
import {sendPicture} from "./Services/ImageService"
import { Buffer } from "buffer";

export default function App() {

const canvasRef = useRef(null)
const [picture, setPicture] = useState(null)
const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const [prediction, setPrediction] = useState("")

function updateDrawing() {
  const base64 = canvasRef.current.canvasContainer.childNodes[1].toDataURL().split(',')[1]
  console.log(canvasRef.current)
  const bytes = Buffer.from(base64, "base64")
  setPicture(bytes)
}

const onCanvasChange = (event) => {
    updateDrawing()
  };

const onPredictButtonClick = async (event) => {
    event.preventDefault()
    setPrediction("")
    if (!picture) {
      console.log("Please write a digit first.")
      return
    }
    const response = await sendPicture(picture)
    console.log(response)
    if (response) {
      if (response.status === 200) {
          setPrediction(response.data[0])
          // setSnackText("Updated successfully!");
          // setSnackColor("success");
          // setSnackOpen(true);
          // setEditingMode(false);
      } else {
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
  updateDrawing()
}

  return (
    <div className={"content"}>
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
      <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
        {
          digits.map((digit, i) => (
            <div key={digit} className={"corners"} style={{border: i === prediction ? "3px solid red" : "3 px solid green"}}>{digit}</div>
          ))
        }
      </div>
    </div>
  )
}