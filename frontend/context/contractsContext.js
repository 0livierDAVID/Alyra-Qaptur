import { createContext, useContext, useReducer } from "react";

import main from "../../backend/artifacts/contracts/QapturState.sol/QapturState.json";
import factory from "../../backend/artifacts/contracts/QapturProjectFactory.sol/QapturProjectFactory.json";
import reward from "../../backend/artifacts/contracts/QapturProjectReward.sol/QapturProjectReward.json";
import usdc from "../../backend/artifacts/contracts/USDCTest.sol/USDCTest.json";
import qlandMarketplace from "../../backend/artifacts/contracts/QapturLandMarketplace.sol/QapturLandMarketplace.json";
//import qco2Marketplace from "../../backend/artifacts/contracts/QapturCo2Marketplace.sol/QapturCo2Marketplace.json";

import contractsJson from "../contracts/contracts.json";

const ContractsContext = createContext(null);

const ContractsDispatchContext = createContext(null);

export function ContractsProvider({ children }) {
  const [contracts, dispatch] = useReducer(contractsReducer, initialContracts);

  return (
    <ContractsContext.Provider value={contracts}>
      <ContractsDispatchContext.Provider value={dispatch}>
        {children}
      </ContractsDispatchContext.Provider>
    </ContractsContext.Provider>
  );
}

export function useContracts() {
  return useContext(ContractsContext);
}

export function useContractsDispatch() {
  return useContext(ContractsDispatchContext);
}

function contractsReducer(contracts, action) {
  switch (action.type) {
    case "initContracts": {
      // console.log(contractsJson[action.chainId]);
      if (!action.chainId) return contracts;
      const json = contractsJson[action.chainId];
      return {
        ...contracts,
        chainId: action.chainId,
        deployer: json.deployer,
        main: {
          ...contracts.main,
          address: json.main.address,
        },
        factory: {
          ...contracts.factory,
          address: json.factory.address,
        },
        reward: {
          ...contracts.reward,
          address: json.reward.address,
        },
        usdc: {
          ...contracts.usdc,
          address: json.usdc.address,
        },
        qlandMarketplace: {
          ...contracts.qlandMarketplace,
          address: json.qlandMarketplace.address,
        },
        // qco2Marketplace: {
        // ...contracts.qco2Marketplace,
        //   address: json.qco2Marketplace.address,
        // },
      };
    }
    // initToken
    case "initToken": {
      const token = action.token;
      if (!token?.symbol || token.symbol !== "USDC") return contracts;
      return {
        ...contracts,
        erc20: {
          ...contracts.erc20,
          decimals: token.decimals,
          name: token.name,
          symbol: token.symbol,
        },
      };
    }
    // purge context on disconnect
    case "clear": {
      return initialContracts;
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

const initialContracts = {
  chainId: null,
  deployer: null,
  erc20: {
    decimals: 0,
    name: "",
    symbol: "",
  },
  main: {
    address: null,
    abi: main.abi,
  },
  factory: {
    address: null,
    abi: factory.abi,
  },
  reward: {
    address: null,
    abi: reward.abi,
  },
  usdc: {
    address: null,
    abi: usdc.abi,
  },
  qlandMarketplace: {
    address: null,
    abi: qlandMarketplace.abi,
  },
  // qco2Marketplace: {
  //   address: null,
  //   abi: qco2MarketplaceAbi,
  // },
};
