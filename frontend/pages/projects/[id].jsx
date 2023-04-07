import Head from "next/head";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { Typography, Grid, Box } from "@mui/material";
import Layout from "@/components/Layout";
import ProjectSummary from "@/components/Projects/ProjectSummary";
import ProjectDetails from "@/components/Projects/ProjectDetails";
import ProjectInvest from "@/components/Projects/ProjectInvest";

const inter = Inter({ subsets: ["latin"] });

export default function Project() {
  const router = useRouter();
  const { id } = router.query;
  const projectName = "Project name";
  // check valid id: else come back later
  return (
    <Layout>
      <Head>
        <title>{projectName} - Qaptur</title>
      </Head>
      <Typography variant="h4" component="h1">
        {projectName}
      </Typography>
      <Grid container spacing={1}>
        <ProjectSummary />
        <ProjectDetails />
        <ProjectInvest />
      </Grid>
    </Layout>
  );
}
