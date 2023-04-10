import Head from "next/head";
import { useAccount } from "wagmi";
import { Inter } from "next/font/google";
import { Grid, Typography } from "@mui/material";
import Layout from "@/components/Layout";
import NotConnectedAlert from "@/components/Layout/helper/NotConnectedAlert";
import CarbonCreditCard from "@/components/CarbonCredits/CarbonCreditCard";

const inter = Inter({ subsets: ["latin"] });

export default function CarbonCredits() {
  const { isConnected } = useAccount();
  return (
    <Layout>
      <Head>
        <title>Carbon credits - Qaptur</title>
      </Head>
      <Typography variant="h4" component="h1">
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
