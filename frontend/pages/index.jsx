import { useEffect } from "react";
import Head from "next/head";
import { Inter } from "next/font/google";
import { useAccount, useContractRead, useContractEvent, useToken } from "wagmi";
import { useContracts } from "@/context/contractsContext";

import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });

// TODO: chainId change management

export default function App() {
  const { isConnected, address } = useAccount();
  const { main, usdc } = useContracts();

  const usdcContractRead = useContractRead({
    ...usdc,
    functionName: "totalSupply",
    args: [],
    enabled: Boolean(isConnected),
    onSuccess(data) {
      console.log("Success usdc", data);
    },
    onError(error) {
      console.log("Error usdc", error);
    },
    // onSettled(data, error) {
    //   console.log("Settled", { data, error });
    // },
    // watch: true, // Watches and refreshes data for new blocks.
    // structuralSharing: (prev, next) => (prev === next ? prev : next),
  });

  const usdcContractRead2 = useContractRead({
    ...usdc,
    functionName: "balanceOf",
    args: [address],
    enabled: Boolean(isConnected),
    onSuccess(data) {
      console.log("Success balance usdc", data);
    },
    onError(error) {
      console.log("Error balance usdc", error);
    },
    // onSettled(data, error) {
    //   console.log("Settled", { data, error });
    // },
    // watch: true, // Watches and refreshes data for new blocks.
    // structuralSharing: (prev, next) => (prev === next ? prev : next),
  });

  const mainContractRead = useContractRead({
    ...main,
    functionName: "projects",
    args: [1],
    enabled: Boolean(isConnected),
    onSuccess(data) {
      console.log("Success main", data);
    },
    onError(error) {
      console.log("Error main", error);
    },
    // onSettled(data, error) {
    //   console.log("Settled", { data, error });
    // },
  });

  const mainContractRead2 = useContractRead({
    //...main,
    functionName: "getNewId",
    args: [],
    enabled: Boolean(isConnected),
    onSuccess(data) {
      console.log("Success main2", data);
    },
    onError(error) {
      console.log("Error main2", error);
    },
    // onSettled(data, error) {
    //   console.log("Settled", { data, error });
    // },
  });

  const projectCreatedOldEvent = useContractEvent({
    ...main,
    eventName: "NewProjectDeployed",
    listener(node, resolver) {
      console.log(node, resolver);
    },
  });
  const projectCreatedEvent = useContractEvent({
    ...main,
    eventName: "NewProjectDeployed",
    listener(node, resolver) {
      console.log(node, resolver);
    },
  });

  const { data, isError, isLoading } = useToken({
    address: usdc.address,
    // formatUnits: 'gwei', //Defaults to ether
  });

  useEffect(() => {
    console.log("events", projectCreatedOldEvent);
  }, [projectCreatedOldEvent]);

  // if (isLoading) return <div>Fetching token…</div>;
  // if (isError) return <div>Error fetching token</div>;
  // return <div>Token: {data?.symbol}</div>;

  return (
    <Layout>
      <Head>
        <title>Welcome page - Qaptur</title>
      </Head>
      Incredible landing page without side menu!
      <br />
      Only connect button in the header. (Content need to be defined)
      <br />
      {!isLoading && !isError && <div>Token: {data?.decimals}</div>}
    </Layout>
  );
}
