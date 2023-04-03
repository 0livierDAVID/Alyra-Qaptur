import Head from "next/head";
import { Inter } from "next/font/google";
import { Grid, Typography } from "@mui/material";

import Layout from "@/components/Layout";
import ProjectCard from "@/components/Projects/ProjectCard";

const inter = Inter({ subsets: ["latin"] });

export default function Projects() {
  return (
    <Layout>
      <Head>
        <title>Projects list - Qaptur</title>
      </Head>
      <Typography variant="h4" component="h1">
        Projects
      </Typography>
      <Grid container spacing={1}>
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
      </Grid>
    </Layout>
  );
}
