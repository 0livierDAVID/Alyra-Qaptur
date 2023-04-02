import { Inter } from "next/font/google";
import { Grid, Typography } from "@mui/material";
import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });

export default function ProjectAddition() {
  return (
    <Layout>
      <Typography variant="h4" component="h1">
        Deploy a new project
      </Typography>
      <Grid container spacing={1} sx={{ mt: 2 }}>
        TODO: form
      </Grid>
    </Layout>
  );
}
