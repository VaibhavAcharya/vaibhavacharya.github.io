import Head from "next/head";

import "./../styles/tailwind.css";

import Layout from "./../components/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/icon.png" type="image/x-icon" />
        <title>Vaibhav Acharya</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
