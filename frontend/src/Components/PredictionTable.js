import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import '../styles.css'

export default function PredictionTable({prediction, loading}) {

    function isActive(index) {
        const empty = !prediction.some((number) => number > 0)
        return (!empty && index === prediction.indexOf(Math.max(...prediction)))
    }

    return (
        <TableContainer sx={{overflowX: "visible", height: 400, ml: 5}} component={Paper}>
            <Table sx={{height: "inherit"}}>
                <TableBody>
                    {prediction.map((p, index) => (
                    <TableRow  key={index}>
                        <TableCell className={`cell-padding ${isActive(index) ? 'cell-padding-active' : ''}`}>{index}</TableCell>
                        <TableCell className={`cell-padding ${isActive(index) ? 'cell-padding-active' : ''}`}>{(p * 100).toFixed(2)}%</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}