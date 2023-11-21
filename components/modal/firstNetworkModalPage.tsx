import React, { useState } from "react";
import { useSwitchChain, useChain } from "@thirdweb-dev/react";
import {
  Sepolia,
  OptimismGoerli,
  BinanceTestnet,
  BaseGoerli,
  AvalancheFuji,
  Mumbai,
} from "@thirdweb-dev/chains";
import { Modal } from "flowbite-react";
import styles from "./modal.module.css";
import Image from "next/image";
import { MediaRenderer } from "@thirdweb-dev/react";
import dropDownIcon from "../../assets/png/dropdownIcon.png";
export default function FirstNetworkModal() {
  const switchChain = useSwitchChain();
  const chain = useChain();

  const [selectedChain, setSelectedChain] = useState();
  const [openModal, setOpenModal] = useState(false);

  console.log(chain);

  return (
    <div>
      <button onClick={() => setOpenModal(true)} className={styles.activeChain}>
        <MediaRenderer src={chain?.icon?.url} />
        <h4>{chain?.name ? chain?.name : `Connect Wallet`}</h4>{" "}
        <Image
          className={styles.dropDownIcon}
          src={dropDownIcon}
          width={20}
          height={20}
          alt="Drowdown Image"
        />
      </button>
      <Modal
        className={styles.Modal}
        show={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header className={styles.ModalHeader}>
          <h2>Select a Chain</h2>
          <p>
            Select a chain from our default list or search for a token by symbol
            or address.
          </p>
        </Modal.Header>
        <Modal.Body className={styles.ModalBody}>
          <div className="space-y-6">
            <button className={styles.activeChain}>
              <MediaRenderer src={chain?.icon?.url} />
              {chain?.name ? chain?.name : `Connect Wallet`}
            </button>

            <div className={styles.SwitchChains}>
              <button onClick={() => switchChain(Sepolia.chainId)}>
                <MediaRenderer src={Sepolia.icon.url} />
                Sepolia
              </button>{" "}
              <button onClick={() => switchChain(Mumbai.chainId)}>
                <MediaRenderer src={Mumbai.icon.url} />
                Mumbai
              </button>{" "}
              <button onClick={() => switchChain(AvalancheFuji.chainId)}>
                <MediaRenderer src={AvalancheFuji.icon.url} />
                AvalancheFuji
              </button>{" "}
              <button onClick={() => switchChain(BaseGoerli.chainId)}>
                <MediaRenderer src={BaseGoerli.icon.url} />
                BaseGoerli
              </button>{" "}
              <button onClick={() => switchChain(OptimismGoerli.chainId)}>
                <MediaRenderer src={OptimismGoerli.icon.url} />
                OptimismGoerli
              </button>{" "}
              <button onClick={() => switchChain(BinanceTestnet.chainId)}>
                <MediaRenderer src={BinanceTestnet.icon.url} />
                BinanceTestnet
              </button>{" "}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
