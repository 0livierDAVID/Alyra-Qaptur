import Head from "next/head";
import { Inter } from "next/font/google";
import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Welcome page - Qaptur</title>
      </Head>
      Incredible landing page without side menu!
      <br />
      Only connect button in the header.
      <br />
      (Content need to be defined)
    </Layout>
  );
}
