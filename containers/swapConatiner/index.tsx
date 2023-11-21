import React from "react";
import styles from "./index.module.css";
import NetworkDropdown from "@/components/dropdown/firstNetwork";
import SingleCrossSwapInput from "@/components/inputs/singleCrossPayment/singleCrossSwapInput";
import SecondNetworkDropdown from "@/components/dropdown/secondNetwork";
import ConnectWalletPage from "@/components/connectWalletPage";
import { useAddress } from "@thirdweb-dev/react";
import FirstNetworkModal from "@/components/modal/firstNetworkModalPage";
//SecondNetworkDropdown
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
      <h1 className={styles.TradeTag}>Trade</h1>

      <p className={styles.coinDetailsTag}>
        1 SUSHI ($0.97) = 0.0004734 ETH ($2.05k)
      </p>

      <div className={styles.crossChainSection}>
        <section className={`${styles.crossChain_Header}`}>
          <h4>Cross Chain Swap</h4>
          <button>
            <h4>Multi cross</h4>
          </button>
        </section>
        <div>
          <section>
            <div className={styles.SwapDropDown}>
              <FirstNetworkModal />
              <h5>to</h5>
              <NetworkDropdown />
            </div>
            <hr />
            <div>
              <SingleCrossSwapInput />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
