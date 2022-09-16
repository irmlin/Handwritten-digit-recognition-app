import {useRef} from "react";
import {Button} from "@mui/material";
import CanvasDraw from "react-canvas-draw";
import { Buffer } from "buffer";
import "../styles.css"

export default function DrawingBoard(props)  {

    const canvasRef = useRef(null)
    const {
            onPredictButtonClick,
            setPicture,
            onDialogOpen,
            evaluateButtonEnabled,
            setEvaluateButtonEnabled,
        } = props;

    const onCanvasChange = (event) => {
        updateDrawing()
    };

    function updateDrawing() {
        const base64 = canvasRef.current.canvasContainer.childNodes[1].toDataURL().split(',')[1]
        const bytes = Buffer.from(base64, "base64")
        setPicture(bytes)
    }

    const onClearButtonClick = (event) => {
        canvasRef.current.clear()
        setEvaluateButtonEnabled(false)
        setPicture(null)
    }
      
    const onUndoButtonClick = (event) => {
        canvasRef.current.undo()
        if(!canvasRef.current.lines.length) {
          setPicture(null)
          setEvaluateButtonEnabled(false)
        } else {
          updateDrawing()
        }
    }

    return (
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
            <Button variant={"contained"} onClick={onDialogOpen} fullWidth disabled={!evaluateButtonEnabled}>
                <b>Evalutate Prediction</b>
            </Button>
        </div>
    )
}