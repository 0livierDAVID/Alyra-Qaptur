import { useNetwork } from "wagmi";
import { useContracts } from "@/context/contractsContext";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Link from "next/link";

export default function TabTransactions({ userTransactions }) {
  const { explorer } = useContracts();
  const { chain } = useNetwork();
  const prepareHash = (hash) => {
    if (chain.id === 31337) return hash;
    else {
      const title = `See transaction on ${explorer[chain.id].name}`;
      const url = `${explorer[chain.id].tx}${hash}`;
      return (
        <Link href={url} target="_blank" title={title}>
          {hash}
        </Link>
      );
    }
  };
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
              <TableCell>{prepareHash(tr.hash)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
