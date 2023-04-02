import { Inter } from "next/font/google";
import { Grid, Typography } from "@mui/material";
import Layout from "@/components/Layout";

import CarbonCreditCard from "@/components/CarbonCredits/CarbonCreditCard";

const inter = Inter({ subsets: ["latin"] });

export default function CarbonCredits() {
  return (
    <Layout>
      <Typography variant="h4" component="h1">
        Carbon credits
      </Typography>
      <Grid container spacing={1}>
        <CarbonCreditCard />
        <CarbonCreditCard />
        <CarbonCreditCard />
        <CarbonCreditCard />
      </Grid>
    </Layout>
  );
}
