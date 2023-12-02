import React from "react";
import dynamic from "next/dynamic";

import styles from "./index.module.css";

const ConnectWalletPage = dynamic(
  () => import("@/components/connectWalletPage")
);
const FirstNetworkModal = dynamic(
  () => import("@/components/modal/firstNetworkModalPage")
);
const SecondNetworkModal = dynamic(
  () => import("@/components/modal/secondNetworkModal")
);

const DynamicCrossSwapInput = dynamic(
  () => import(`@/components/inputs/singleCrossPayment/singleCrossSwapInput`)
);
import CoinPrice from "@/components/coinPrice/Coinprice";
import { useAddress } from "@thirdweb-dev/react";
export default function SwapContainer() {
  const address = useAddress();
  if (!address)
    return (
      <div>
        <ConnectWalletPage />
      </div>
    );

  return (
    <div className={styles.SwapContainer}>
      <h1 className={styles.TradeTag}>Swap</h1>

      <div className={styles.coinDetailsTag}>
        <CoinPrice />
      </div>
      <div className={styles.crossChainSection}>
        <section className={`${styles.crossChain_Header}`}>
          <h4>Cross Chain Swap</h4>
        </section>
        <div>
          <section>
            <div className={styles.SwapDropDown}>
              <FirstNetworkModal />
              <h5>to</h5>
              <SecondNetworkModal />
            </div>
            <hr />
            <div>
              <DynamicCrossSwapInput />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
