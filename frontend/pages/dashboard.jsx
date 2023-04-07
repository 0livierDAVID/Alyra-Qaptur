import Head from "next/head";
import { Typography } from "@mui/material";
import Layout from "@/components/Layout";
import Boxes from "@/components/Dashboard/Boxes";
import Assets from "@/components/Dashboard/Assets";

export default function Dashboard() {
  /** Data
   * - project share on request by card (hidden by default if sup 0 show)
   * - transactions market place filter from or to (address)
   *
   */

  return (
    <Layout>
      <Head>
        <title>My dashboasd - Qaptur</title>
      </Head>
      <Typography variant="h4" component="h1">
        Dashboard
      </Typography>
      <Boxes />
      <Assets />
    </Layout>
  );
}
