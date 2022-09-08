import CanvasDraw from "react-canvas-draw";
import {useState, useRef} from "react";
import {Button} from "@mui/material";
import "./styles.css"

export default function App() {

const canvasRef = useRef(null)
const [drawing, setDrawing] = useState(null)

function updateDrawing() {
  const base64 = canvasRef.current.canvasContainer.childNodes[1].toDataURL();
  setDrawing(base64)
}

const onCanvasChange = (event) => {
    updateDrawing()
  };

const onPredictButtonClick = (event) => {
  console.log("predicting")
}

const onClearButtonClick = (event) => {
  canvasRef.current.clear()
  setDrawing(null)
}

const onUndoButtonClick = (event) => {
  canvasRef.current.undo()
  updateDrawing()
}

  return (
    <div className={"content"}>
      <CanvasDraw
              ref={canvasRef}
              style={{
                boxShadow:
                  "0 13px 27px -5px rgba(50, 50, 93, 0.25),    0 8px 16px -8px rgba(0, 0, 0, 0.3)"
              }}
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