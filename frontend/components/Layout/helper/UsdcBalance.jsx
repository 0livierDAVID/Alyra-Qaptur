import { useEffect, useState } from "react";
import { Contract } from "ethers";
import { useProvider } from "wagmi";
import { Chip, Avatar } from "@mui/material";
import { useProjects } from "@/context/projectsContext";
import { useContracts } from "@/context/contractsContext";
import useUserStatus from "@/hooks/useUserStatus";
import { toUsdc } from "@/utils";

const UsdcBalance = () => {
  const { usdc } = useContracts();
  const provider = useProvider();
  const { isConnected, address } = useUserStatus();
  const { array: projects } = useProjects();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    getUserBalance();
  }, [projects, address]);

  const getUserBalance = async () => {
    if (usdc) {
      try {
        const contract = new Contract(usdc.address, usdc.abi, provider);
        const userBalance = await contract.balanceOf(address);
        setBalance(toUsdc(userBalance));
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      {isConnected && (
        <Chip
          sx={{ float: "right", fontWeight: "bold" }}
          variant="outlined"
          color="primary"
          label={`${balance} USDC`}
          avatar={<Avatar alt="USDC logo" src="/images/usdc.svg" />}
        />
      )}
    </>
  );
};

export default UsdcBalance;
