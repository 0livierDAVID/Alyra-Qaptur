import Head from "next/head";
import { Inter } from "next/font/google";
import { Grid, Typography } from "@mui/material";
import Layout from "@/components/Layout";
import NotConnectedAlert from "@/components/Layout/helper/NotConnectedAlert";
import CarbonCreditCard from "@/components/CarbonCredits/CarbonCreditCard";
import useUserStatus from "@/hooks/useUserStatus";
import StaticData from "@/components/Layout/helper/StaticData";

const inter = Inter({ subsets: ["latin"] });

export default function CarbonCredits() {
  const { isConnected } = useUserStatus();
  return (
    <Layout>
      <StaticData />
      <Head>
        <title>Carbon credits - Qaptur</title>
      </Head>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", mb: 1 }}
      >
        Carbon credits
      </Typography>
      {!isConnected && <NotConnectedAlert />}

      {isConnected && (
        <Grid container spacing={1}>
          <CarbonCreditCard />
          <CarbonCreditCard />
          <CarbonCreditCard />
          <CarbonCreditCard />
        </Grid>
      )}
    </Layout>
  );
}
