import {Button, TextField} from "@mui/material";

export default function FeedbackSection(props) {

    const {onVerifyButtonClick, onYesButtonClick, onNoButtonClick, visible} = props

    return (
        <div>
            <p>Did the model correctly guess your digit?</p>
            <div style={{display:"flex"}}>
                <Button variant={"contained"} onClick={onYesButtonClick}>
                    <b>Yes</b>
                </Button>
                <Button variant={"contained"} onClick={onNoButtonClick}>
                    <b>No</b>
                </Button>
            </div>
            <TextField 
                type="number"
                InputProps={{
                    inputProps: { 
                        max: 9, min: 0 
                    }
                }}

            />
            <Button variant={"contained"} onClick={onVerifyButtonClick}>
                <b>Verify</b>
            </Button>
        </div>
    );
}