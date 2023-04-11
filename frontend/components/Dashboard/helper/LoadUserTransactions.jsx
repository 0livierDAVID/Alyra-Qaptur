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
        if (toTransactions.length > 0) {
          // console.log("to", toTransactions);
        }

        // Sell
        const fromFilter = contract.filters.TransferSingle(null, address);
        const fromTransactions = await contract.queryFilter(fromFilter);
        if (toTransactions.length > 0) {
          // console.log("from", fromTransactions);
        }
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
