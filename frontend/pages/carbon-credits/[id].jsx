import Head from "next/head";
import { Inter } from "next/font/google";
import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });

export default function CarbonCredit() {
  return (
    <Layout>
      <Head>
        <title>Carbon credit page - Qaptur</title>
      </Head>
      Carbon credit on sale item page
    </Layout>
  );
}
