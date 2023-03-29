import "@/styles/globals.css";
import Head from "next/head";
import Layout from "@/components/layout";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Head>
        <title key="title">Story Beats</title>
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}
