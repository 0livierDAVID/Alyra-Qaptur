import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import {
  useContracts,
  useContractsDispatch,
} from "../context/contractsContext";

const useContractsAvailable = () => {
  const [contractsAvailable, setContractsAvailable] = useState(false);
  const { address } = useAccount();
  const { chain } = useNetwork();

  const { chainId } = useContracts();
  const contractsDispatch = useContractsDispatch();

  useEffect(() => {
    // console.log(chain.id, chainId);
    // console.log(contractsAvailable);
    if (chain?.id && chain.id !== chainId) {
      clearContext();
      initContracts();
      setContractsAvailable(true);
      console.log("contracts update");
    } else {
      setContractsAvailable(Boolean(chainId));
    }
  }, [chain]);

  const initContracts = () => {
    contractsDispatch({
      type: "initContracts",
      chainId: chain.id,
    });
  };

  const clearContext = () => {
    contractsDispatch({
      type: "clear",
    });
  };

  return contractsAvailable;
};

export default useContractsAvailable;
