import { useState } from "react";
import Head from "next/head";
import { useAccount } from "wagmi";
import { Typography } from "@mui/material";
import Layout from "@/components/Layout";
import Boxes from "@/components/Dashboard/Boxes";
import Assets from "@/components/Dashboard/Assets";
import LoadUserProjects from "@/components/Dashboard/helper/LoadUserProjects";
import NotConnectedAlert from "@/components/Layout/helper/NotConnectedAlert";

export default function Dashboard() {
  /** Data
   * - project share on request by card (hidden by default if sup 0 show)
   * - transactions market place filter from or to (address)
   *
   */
  const [userProjects, setUserProjects] = useState([]);
  const { isConnected } = useAccount();

  const updateUserProjects = (newVal) => {
    const array = userProjects.push(newVal);
    setUserProjects(array);
    //console.log(userProjects);
  };

  return (
    <Layout>
      <Head>
        <title>My dashboasd - Qaptur</title>
      </Head>
      <Typography variant="h4" component="h1">
        Dashboard
      </Typography>

      {!isConnected && <NotConnectedAlert />}

      {isConnected && (
        <>
          <LoadUserProjects
            // userProjects={userProjects}
            updateUserProjects={updateUserProjects}
          />
          <Boxes />
          <Assets />
        </>
      )}
    </Layout>
  );
}
