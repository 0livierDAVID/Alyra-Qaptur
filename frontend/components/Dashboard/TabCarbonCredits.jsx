import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";

export default function TabCarbonCredits() {
  return (
    <TableContainer component={Box}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Project</TableCell>
            <TableCell align="right">Tokens</TableCell>
            <TableCell align="center">Emission date</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Project A</TableCell>
            <TableCell align="right">90</TableCell>
            <TableCell align="center">01/2021</TableCell>
            <TableCell align="center">
              <Button variant="contained" sx={{ mr: 1 }}>
                Use
              </Button>
              <Button variant="contained">Sell</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Project A</TableCell>
            <TableCell align="right">90</TableCell>
            <TableCell align="center">01/2021</TableCell>
            <TableCell align="center">
              <Button variant="contained" sx={{ mr: 1 }}>
                Use
              </Button>
              <Button variant="contained">Sell</Button>
            </TableCell>
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
