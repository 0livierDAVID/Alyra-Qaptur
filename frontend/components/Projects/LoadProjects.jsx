import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useProvider, useSigner } from "wagmi";
import axios from "axios";
import { Inter } from "next/font/google";
import { Alert } from "@mui/material";

import { useContracts } from "@/context/contractsContext";
import { useProjects, useProjectsDispatch } from "@/context/projectsContext";
import useContractsAvailable from "@/hooks/useContractsAvailable";

const inter = Inter({ subsets: ["latin"] });

export default function LoadProjects() {
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

  const saveOrUpdateProject = async (project) => {
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

      if (id > projectsArray.length) {
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
      } else {
        const localProject = projectsArray.filter(
          (project) => project.id === id
        );
        if (localProject.availableSupply !== availableSupply.toNumber()) {
          // update available supply in context
          dispatch({
            type: "updateSupply",
            projectId: id,
            newSupply: availableSupply,
          });
        }
      }
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
      console.log(projects);
      projects.forEach((project) => {
        const projectId = project.args.id.toNumber();
        // console.log(project);
        // console.log("test", projectId, projectsArray.length);

        // store project or update supply if needed
        saveOrUpdateProject(project);
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
