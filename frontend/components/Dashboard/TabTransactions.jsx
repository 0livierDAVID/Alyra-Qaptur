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
            <TableCell>Date</TableCell>
            <TableCell align="center">Action</TableCell>
            <TableCell align="center">Project</TableCell>
            <TableCell align="center">Shares</TableCell>
            <TableCell>Transaction hash</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userTransactions.map((tr) => (
            <TableRow
              key={tr.timestamp}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{tr.date}</TableCell>
              <TableCell align="center">{tr.type}</TableCell>
              <TableCell align="center">{tr.projectId}</TableCell>
              <TableCell align="center">{tr.nbShares}</TableCell>
              <TableCell>{tr.hash}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
