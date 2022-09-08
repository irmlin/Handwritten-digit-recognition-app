import CanvasDraw from "react-canvas-draw";
import {useState, useRef} from "react";
import {Button} from "@mui/material";
import "./styles.css"
import {sendPicture} from "./Services/ImageService"

export default function App() {

const canvasRef = useRef(null)
const [picture, setPicture] = useState(null)

function updateDrawing() {
  const base64 = canvasRef.current.canvasContainer.childNodes[1].toDataURL();
  setPicture(base64)
}

const onCanvasChange = (event) => {
    updateDrawing()
  };

const onPredictButtonClick = async (event) => {
    event.preventDefault()
    if (!picture) {
      console.log("Please write a digit first.")
      return
    }
    const response = await sendPicture(picture)
    console.log(response)
  //   if (response) {
  //     if (response.status === 200) {
  //         setSnackText("Updated successfully!");
  //         setSnackColor("success");
  //         setSnackOpen(true);
  //         setEditingMode(false);
  //     } else {
  //         setSnackColor("error");
  //         setSnackText("Update failed")
  //     }
  // } else {
  //     setSnackColor("error");
  //     setSnackText("A server error has occurred.");
  // }
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
      <div style={{display:"flex"}}>
        <Button style={{width:"33.3%"}} color={"success"} variant={"contained"} onClick={onPredictButtonClick}>
          Predict
        </Button>

        <Button style={{width:"33.3%"}} color={"error"} variant={"contained"} onClick={onClearButtonClick}>
          Clear Image
        </Button>

        <Button style={{width:"33.3%"}} variant={"contained"} onClick={onUndoButtonClick}>
          Undo
        </Button>
      </div>
    </div>
  )
}