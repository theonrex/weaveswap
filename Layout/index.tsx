import { Inter } from "next/font/google";
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
import { Sepolia } from "@thirdweb-dev/chains";
import { selectActiveChain } from "@/redux/features/activeChain";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode }) {
  const currentChain = useSelector(selectActiveChain);

  return (
    <ThirdwebProvider
      activeChain={currentChain?.chainId}
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
      {children}
      <ToastContainer />
    </ThirdwebProvider>
  );
}
