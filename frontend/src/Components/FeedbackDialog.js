import {
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Checkbox,
    FormGroup,
    FormControlLabel
} from "@mui/material";

export default function FeedbackDialog (props) {

    const {onDialogClose, onTextfieldChange, onVerifyButtonClick, onYesClick, onNoClick, dialogState, label} = props

    return (
        <Dialog onClose={onDialogClose} open={dialogState.dialogOpen}>
            <DialogTitle>Did the model guess your digit correctly?</DialogTitle>
            <DialogContent>
                <FormGroup row style={{justifyContent: "center"}}>
                    <FormControlLabel
                        label={"Yes"}
                        control={<Checkbox checked={dialogState.yesChecked} onChange={onYesClick}/>}
                    >
                    </FormControlLabel>
                    <FormControlLabel
                        label={"No"}
                        control={<Checkbox checked={dialogState.noChecked} onChange={onNoClick}/>}
                    >       
                    </FormControlLabel>
                </FormGroup>
                <div style={{textAlign: "center", display: dialogState.textfieldDisplay}}>
                    <TextField 
                        type={"number"}
                        size={"small"}
                        fullWidth
                        label={"Please enter the correct digit"}
                        onChange={onTextfieldChange}
                        disabled={!dialogState.textfieldEnabled}
                        InputProps={{
                            inputProps: { 
                                max: 9, min: 0 
                            }
                        }}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button fullWidth variant={"contained"} onClick={onVerifyButtonClick} disabled={!dialogState.verifyButtonEnabled}>
                        <b>Verify</b>
                </Button>
            </DialogActions>
        </Dialog>
    );
}