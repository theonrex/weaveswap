import type { AppProps } from "next/app";
import "../styles/globals.css";
import "flowbite";
import { useState } from "react";

import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import Layout from "../Layout/index";
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Layout>
        <WagmiConfig config={config}>
          <Component {...pageProps} />
        </WagmiConfig>
      </Layout>
    </Provider>
  );
}
