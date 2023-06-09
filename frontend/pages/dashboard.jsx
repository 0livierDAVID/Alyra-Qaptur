import { useState } from "react";
import Head from "next/head";
import { Typography } from "@mui/material";
import Layout from "@/components/Layout";
import Boxes from "@/components/Dashboard/Boxes";
import Assets from "@/components/Dashboard/Assets";
import LoadUserProjects from "@/components/Dashboard/helper/LoadUserProjects";
import NotConnectedAlert from "@/components/Layout/helper/NotConnectedAlert";
import useUserStatus from "@/hooks/useUserStatus";
import { useProjects } from "@/context/projectsContext";
import LoadUserTransactions from "@/components/Dashboard/helper/LoadUserTransactions";
import UsdcBalance from "@/components/Layout/helper/UsdcBalance";

export default function Dashboard() {
  /** Data
   * - project share on request by card (hidden by default if sup 0 show)
   * - transactions market place filter from or to (address)
   *
   */
  const { array: projects } = useProjects();
  const [userProjects, setUserProjects] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const { isConnected } = useUserStatus();

  const updateUserProjects = (newVal) => {
    const array = userProjects;
    array.push(newVal);
    setUserProjects(array);
    //console.log(userProjects);
  };

  const updateUserTransactions = (newVal) => {
    // console.log("update", newVal);
    let array = userTransactions;
    array.push(...newVal);
    // sort by blockNumber
    array.sort((a, b) => a.blockNumber - b.blockNumber);
    // filter duplicates
    array = array.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.hash === value.hash)
    );
    setUserTransactions(array);
    // console.log("update", userTransactions);
  };

  return (
    <Layout>
      <LoadUserProjects
        projects={projects}
        userProjects={userProjects}
        updateUserProjects={updateUserProjects}
      />
      <LoadUserTransactions
        projects={projects}
        userTransactions={userTransactions}
        updateUserTransactions={updateUserTransactions}
      />
      {isConnected && <UsdcBalance />}
      <Head>
        <title>My dashboasd - Qaptur</title>
      </Head>
      <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
        Dashboard
      </Typography>
      {!isConnected && <NotConnectedAlert />}

      {isConnected && (
        <>
          <Boxes projects={projects} userProjects={userProjects} />
          <Assets
            projects={projects}
            userProjects={userProjects}
            userTransactions={userTransactions}
          />
        </>
      )}
    </Layout>
  );
}
