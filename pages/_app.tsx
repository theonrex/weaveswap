import type { AppProps } from "next/app";
import "../styles/globals.css";
import "flowbite";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import Layout from "../Layout/index";

import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { bscTestnet, polygonMumbai, sepolia } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
const { chains, publicClient } = configureChains(
  [bscTestnet, polygonMumbai, sepolia],
  [publicProvider()]
);
const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "761e2358486f790ea84968e6674bce83",
  chains,
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      {" "}
      <WagmiConfig config={wagmiConfig}>
        {" "}
        <RainbowKitProvider
          chains={chains}
          theme={darkTheme({
            accentColor: "#00df07",

            accentColorForeground: "white",
            borderRadius: "medium",
          })}
        >
          {" "}
          <Layout>
            <Component {...pageProps} />{" "}
          </Layout>{" "}
        </RainbowKitProvider>
      </WagmiConfig>
    </Provider>
  );
}
