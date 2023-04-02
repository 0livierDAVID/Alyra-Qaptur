import { Inter } from "next/font/google";
import { Grid, Typography } from "@mui/material";
import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });

export default function ProjectReward() {
  return (
    <Layout>
      <Typography variant="h4" component="h1">
        Emit project carbon credits reward
      </Typography>
      <Grid container spacing={1} sx={{ mt: 2 }}>
        TODO: form
      </Grid>
    </Layout>
  );
}
