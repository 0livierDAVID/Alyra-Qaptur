import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export default function TabTransactions({ userTransactions }) {
  return (
    <TableContainer component={Box}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Hash</TableCell>
            <TableCell align="center">Date</TableCell>
            <TableCell align="right">Event type</TableCell>
            <TableCell align="center">...</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>0x0dcc08997fcf72269de</TableCell>
            <TableCell align="center">29/01/2021</TableCell>
            <TableCell align="right">Buy</TableCell>
            <TableCell align="center">...</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>0x0dcc08997fcf72269de</TableCell>
            <TableCell align="center">29/01/2021</TableCell>
            <TableCell align="right">Buy</TableCell>
            <TableCell align="center">...</TableCell>
          </TableRow>
          {/* {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))} */}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
