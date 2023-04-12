import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useProvider, useAccount } from "wagmi";
import { Inter } from "next/font/google";
import { Alert } from "@mui/material";

import { useProjects } from "@/context/projectsContext";
import useContractsAvailable from "@/hooks/useContractsAvailable";

const inter = Inter({ subsets: ["latin"] });

export default function LoadUserTransactions({
  projects,
  userTransactions,
  updateUserTransactions,
}) {
  const contractsAvailable = useContractsAvailable();
  const { address, isConnected } = useAccount();
  const { qlandAbi } = useProjects();
  const provider = useProvider();

  const [idProcessed, setIdProcessed] = useState([]);
  const [notif, setNotif] = useState(null);

  useEffect(() => {
    if (projects.length > 0) {
      projects.map((project) => {
        getUserTransactions(project);
      });
    }
  }, [projects]);

  const processTransactions = async (type, transactions, id) => {
    if (transactions.length > 0) {
      // console.log(transactions);
      const transacArr = Promise.all(
        transactions.map(async (tr) => {
          // const tra = await tr.getBlock();
          const blockInfo = await tr.getBlock();
          console.log(blockInfo);
          return {
            date: new Date(blockInfo.timestamp * 1000).toLocaleDateString(),
            timestamp: blockInfo.timestamp,
            hash: tr.transactionHash,
            blockNumber: tr.blockNumber,
            nbShares: tr.args.value.toNumber(),
            projectId: id,
            type,
          };
        })
      );
      // console.log(await transacArr);

      updateUserTransactions(await transacArr);
    }
  };
  const getUserTransactions = async (project) => {
    if (!contractsAvailable || !isConnected) return;
    try {
      // console.log(project);
      const { id, qlandAddr } = project;

      if (!idProcessed.includes(id)) {
        setIdProcessed([...idProcessed, id]);

        // console.log(qlandAddr);
        // get balance of current user
        const contract = new ethers.Contract(qlandAddr, qlandAbi, provider);
        // Buy
        const toFilter = contract.filters.TransferSingle(null, null, address);
        const toTransactions = await contract.queryFilter(toFilter);
        await processTransactions("Buy", toTransactions, id);

        // Sell
        const fromFilter = contract.filters.TransferSingle(null, address);
        const fromTransactions = await contract.queryFilter(fromFilter);
        await processTransactions("Sell", fromTransactions, id);
      }
    } catch (error) {
      setNotif({
        type: "error",
        msg: `Error met during transaction loading. ${error}`,
      });
    }
  };
  return (
    <>
      {notif && (
        <Alert sx={{ mt: 1, mb: 1 }} severity={notif.type}>
          {notif.msg}
        </Alert>
      )}
    </>
  );
}
