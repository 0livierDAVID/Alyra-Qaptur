import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useProvider, useAccount } from "wagmi";
import { Inter } from "next/font/google";
import { Alert } from "@mui/material";

import { useContracts } from "@/context/contractsContext";
import { useProjects } from "@/context/projectsContext";
import useContractsAvailable from "@/hooks/useContractsAvailable";

const inter = Inter({ subsets: ["latin"] });

export default function LoadUserProjects({ updateUserProjects }) {
  const contractsAvailable = useContractsAvailable();
  const { address, isConnected } = useAccount();
  const { main } = useContracts();
  const { qlandAbi } = useProjects();
  const provider = useProvider();

  const [notif, setNotif] = useState(null);

  useEffect(() => {
    loadProjects();
  }, [contractsAvailable, isConnected]);

  const checkUserBalance = async (project) => {
    if (!contractsAvailable || !isConnected) return;
    try {
      //console.log(projectsArray);
      const {
        args: { id, qlandAddr },
      } = project;
      console.log(qlandAddr);
      // get balance of current user
      const contract = new ethers.Contract(qlandAddr, qlandAbi, provider);
      const balance = (await contract.balanceOf(address, 0)).toNumber();
      if (balance > 0) {
        updateUserProjects({ id: id.toNumber(), balance: balance });
      }
    } catch (error) {
      setNotif({
        type: "error",
        msg: `Error met during balance check process. ${error}`,
      });
    }
  };

  const loadProjects = async () => {
    if (!contractsAvailable || !isConnected) return;
    try {
      // console.log(main);
      // get events NewProjectDeployed from the contracts
      console.log(main.address);
      const contract = new ethers.Contract(main.address, main.abi, provider);
      const filter = contract.filters.NewProjectDeployed();
      const projects = await contract.queryFilter(filter);
      console.log(projects);

      projects.forEach((project) => {
        checkUserBalance(project);
      });
    } catch (error) {
      setNotif({
        type: "error",
        msg: `Error met during projects loading process. ${error}`,
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
