import Head from "next/head";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { Typography, Grid } from "@mui/material";
import { useProjects } from "@/context/projectsContext";
import Layout from "@/components/Layout";
import ProjectSummary from "@/components/Projects/ProjectSummary";
import ProjectDetails from "@/components/Projects/ProjectDetails";
import ProjectInvest from "@/components/Projects/ProjectInvest";
import UsdcBalance from "@/components/Layout/helper/UsdcBalance";

const inter = Inter({ subsets: ["latin"] });

export default function Project() {
  const router = useRouter();
  const { id } = router.query;
  const { array: projects } = useProjects();
  const project = projects.find((project) => project.id == id);

  // check valid id: else come back later
  return (
    <Layout>
      <Head>
        <title>{project?.name} - Qaptur</title>
      </Head>
      <UsdcBalance />
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", mb: 1 }}
      >
        {project?.name}
      </Typography>
      <Grid container spacing={1}>
        <ProjectSummary {...project} />
        <ProjectDetails {...project} />
        <ProjectInvest {...project} />
      </Grid>
    </Layout>
  );
}
