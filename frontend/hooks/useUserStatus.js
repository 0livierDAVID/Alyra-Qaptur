import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { useContracts } from "../context/contractsContext";

const useUserStatus = () => {
  const { isConnected: connected, address } = useAccount();
  const { chain } = useNetwork();
  const { deployer } = useContracts();
  const [userStatus, setUserStatus] = useState({
    isConnected: false,
    isAdmin: false,
    address: null,
  });

  useEffect(() => {
    setUserStatus({
      ...userStatus,
      isConnected: connected,
      isAdmin: Boolean(address === deployer),
      address: address,
    });
  }, [address, deployer]);

  return userStatus;
};

export default useUserStatus;
