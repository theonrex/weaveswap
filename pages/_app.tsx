import type { AppProps } from "next/app";
import "../styles/globals.css";
import "flowbite";
import { useState } from "react";
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  safeWallet,
  localWallet,
  embeddedWallet,
  trustWallet,
} from "@thirdweb-dev/react";
import ChainContext from "@/Context/Chain";
import { Mumbai } from "@thirdweb-dev/chains";
import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { Provider } from "react-redux";
import { store } from "../redux/store";

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
      <ThirdwebProvider
        activeChain={Mumbai}
        clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
        supportedWallets={[
          metamaskWallet(),
          coinbaseWallet({ recommended: true }),
          walletConnect(),
          safeWallet({
            recommended: true,
            personalWallets: [
              metamaskWallet(),
              coinbaseWallet({ recommended: true }),
              walletConnect(),
              localWallet(),
              embeddedWallet({
                auth: {
                  options: ["email", "google", "apple", "facebook"],
                },
              }),
              trustWallet({ recommended: true }),
            ],
          }),
          localWallet(),
          embeddedWallet({
            auth: {
              options: ["email", "google", "apple", "facebook"],
            },
          }),
          trustWallet({ recommended: true }),
        ]}
      >
        <WagmiConfig config={config}>
          <Component {...pageProps} />
        </WagmiConfig>
      </ThirdwebProvider>
    </Provider>
  );
}
