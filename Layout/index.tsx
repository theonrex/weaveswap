import { Inter } from "next/font/google";
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  safeWallet,
  localWallet,
  trustWallet,
} from "@thirdweb-dev/react";
import { selectActiveChain } from "@/redux/features/activeChain";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/nav/navbar";
import FooterBody from "@/components/footer/Footer";
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
            trustWallet({ recommended: true }),
          ],
        }),
        localWallet(),

        trustWallet({ recommended: true }),
      ]}
    >
      {" "}
      <Navbar />
      {children}
      <FooterBody />
      <ToastContainer />
    </ThirdwebProvider>
  );
}
