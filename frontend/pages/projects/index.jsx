import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useProvider, useSigner } from "wagmi";
import axios from "axios";
import Head from "next/head";
import { Inter } from "next/font/google";
import { Grid, Typography, Alert } from "@mui/material";

import { useContracts } from "@/context/contractsContext";
import { useProjects, useProjectsDispatch } from "@/context/projectsContext";
import Layout from "@/components/Layout";
import ProjectCard from "@/components/Projects/ProjectCard";
import useContractsAvailable from "@/hooks/useContractsAvailable";

const inter = Inter({ subsets: ["latin"] });

export default function Projects() {
  /** Data
   * - all projects
   * - one request by card for details (hidden by default) show when data available
   *
   */
  const contractsAvailable = useContractsAvailable();
  const { main } = useContracts();
  const { array: projectsArray } = useProjects();
  const dispatch = useProjectsDispatch();
  const provider = useProvider();
  const { data: signer } = useSigner();

  const [notif, setNotif] = useState(null);

  useEffect(() => {
    loadEvents();
  }, [contractsAvailable]);

  const loadProject = async (project) => {
    if (!contractsAvailable) return;
    try {
      const { id, price, supply, qco2Addr, qlandAddr } = project.args;

      // console.log("args:", project.args);
      // get json data url from project smart contract
      const contract = new ethers.Contract(main.address, main.abi, provider);
      const { url, availableSupply } = await contract.projects(id);
      // console.log(url, availableSupply);
      // get json from ipfs with axios
      const jsonFile = await axios({
        method: "get",
        url: url,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { name, description, image, attributes } = jsonFile.data;
      // console.log(attributes);
      // save project data to context
      dispatch({
        type: "add",
        project: {
          id,
          name,
          description,
          image,
          url,
          qlandAddr,
          qco2Addr,
          supply: supply.toNumber(),
          price: price.toNumber(),
          availableSupply: availableSupply.toNumber(),
          attributes,
        },
      });
      // setNotif({
      //   type: "success",
      //   msg: `transaction hash: ${transaction.hash}`,
      // });
    } catch (error) {
      setNotif({
        type: "error",
        msg: `Error during loading project data. ${error}`,
      });
    }
  };

  const loadEvents = async () => {
    if (!contractsAvailable) return;
    try {
      // console.log(main);
      const contract = new ethers.Contract(main.address, main.abi, provider);
      const filter = contract.filters.NewProjectDeployed();
      const projects = await contract.queryFilter(filter);
      // console.log(projects);
      projects.forEach((project) => {
        const projectId = project.args.id.toNumber();
        // console.log(project);
        // console.log("test", projectId, projectsArray.length);
        if (projectId > projectsArray.length) {
          loadProject(project);
        }
      });

      // setNotif({
      //   type: "success",
      //   msg: `Projects found: ${projects.length}`,
      // });
    } catch (error) {
      setNotif({
        type: "error",
        msg: `Error met during projects loading process. ${error}`,
      });
    }
  };

  return (
    <Layout>
      <Head>
        <title>Projects list - Qaptur</title>
      </Head>
      <Typography variant="h4" component="h1">
        Projects
      </Typography>
      {notif && (
        <Alert sx={{ mt: 1, mb: 1 }} severity={notif.type}>
          {notif.msg}
        </Alert>
      )}
      <Grid container spacing={1}>
        {projectsArray.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </Grid>
    </Layout>
  );
}
