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

export default function Dashboard() {
  /** Data
   * - project share on request by card (hidden by default if sup 0 show)
   * - transactions market place filter from or to (address)
   *
   */
  const { array: projects } = useProjects();
  const [userProjects, setUserProjects] = useState([]);
  const { isConnected } = useUserStatus();

  const updateUserProjects = (newVal) => {
    const array = userProjects;
    array.push(newVal);
    setUserProjects(array);
    //console.log(userProjects);
  };

  return (
    <Layout>
      <LoadUserProjects
        // userProjects={userProjects}
        updateUserProjects={updateUserProjects}
      />
      <Head>
        <title>My dashboasd - Qaptur</title>
      </Head>
      <Typography variant="h4" component="h1">
        Dashboard
      </Typography>
      {!isConnected && <NotConnectedAlert />}

      {isConnected && (
        <>
          <Boxes projects={projects} userProjects={userProjects} />
          <Assets projects={projects} userProjects={userProjects} />
        </>
      )}
    </Layout>
  );
}
