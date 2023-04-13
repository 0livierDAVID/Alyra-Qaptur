import Head from "next/head";
import { Inter } from "next/font/google";
import { Grid, Typography } from "@mui/material";
import { useProjects } from "@/context/projectsContext";
import Layout from "@/components/Layout";
import ProjectCard from "@/components/Projects/ProjectCard";
import NotConnectedAlert from "@/components/Layout/helper/NotConnectedAlert";
import useUserStatus from "@/hooks/useUserStatus";
import UsdcBalance from "@/components/Layout/helper/UsdcBalance";

const inter = Inter({ subsets: ["latin"] });

export default function Projects() {
  /** Data
   * - all projects
   * - one request by card for details (hidden by default) show when data available
   *
   */
  const { isConnected } = useUserStatus();
  const { array: projectsArray } = useProjects();

  return (
    <Layout>
      <Head>
        <title>Projects list - Qaptur</title>
      </Head>
      <UsdcBalance />
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", mb: 1 }}
      >
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
