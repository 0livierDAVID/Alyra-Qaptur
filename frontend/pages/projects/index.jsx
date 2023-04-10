import Head from "next/head";
import { useAccount } from "wagmi";
import { Inter } from "next/font/google";
import { Grid, Typography } from "@mui/material";
import { useProjects } from "@/context/projectsContext";
import Layout from "@/components/Layout";
import ProjectCard from "@/components/Projects/ProjectCard";
import NotConnectedAlert from "@/components/Layout/helper/NotConnectedAlert";

const inter = Inter({ subsets: ["latin"] });

export default function Projects() {
  /** Data
   * - all projects
   * - one request by card for details (hidden by default) show when data available
   *
   */
  const { isConnected } = useAccount();
  const { array: projectsArray } = useProjects();

  return (
    <Layout>
      <Head>
        <title>Projects list - Qaptur</title>
      </Head>
      <Typography variant="h4" component="h1">
        Projects
      </Typography>

      {!isConnected && <NotConnectedAlert />}

      {isConnected && (
        <Grid container spacing={1}>
          {projectsArray.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </Grid>
      )}
    </Layout>
  );
}
