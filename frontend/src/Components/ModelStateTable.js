import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import '../styles.css'

export default function ModelStateTable({modelState}) {

    const labels = ["Training Accuracy", "Test Accuracy", "Is Training"]

    return (
        <TableContainer sx={{overflowX: "visible", height: 150, ml: 5}} component={Paper}>
            <Table sx={{height: "inherit", width: 250}}>
                <TableBody>
                    {
                        Object.keys(modelState).map((key, index) => (
                            <TableRow key={index}>
                                <TableCell className={'cell-padding'}>{labels[index]}</TableCell>
                                <TableCell className={'cell-padding'}>{modelState[key]}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}