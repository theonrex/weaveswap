import React, { useState } from "react";
import { useSwitchChain, useChain } from "@thirdweb-dev/react";
import { Dropdown } from "flowbite-react";
import {
  Sepolia,
  OptimismGoerli,
  BinanceTestnet,
  BaseGoerli,
  AvalancheFuji,
  Mumbai,
} from "@thirdweb-dev/chains";
import { Button, Modal } from "flowbite-react";
import styles from "./modal.module.css";
import Image from "next/image";
import { MediaRenderer } from "@thirdweb-dev/react";

export default function FirstNetworkModal() {
  const switchChain = useSwitchChain();
  const chain = useChain();

  const [selectedChain, setSelectedChain] = useState();
  const [openModal, setOpenModal] = useState(false);

  console.log(Sepolia);

  return (
    <div>
      <Button onClick={() => setOpenModal(true)}>Toggle modal</Button>
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
              {chain?.name ? chain?.name : `Connect Wallet`}
            </button>

            <div className={styles.SwitchChains}>
              <button onClick={() => switchChain(Sepolia.chainId)}>
                Sepolia
                <MediaRenderer src="ipfs://QmV4HC9fNrPJQeYpbW55NLLuSBMyzE11zS1L4HmL6Lbk7X" />
                <Image
                  src={Sepolia.icon}
                  alt="{Sepolia.icon}"
                  width={512}
                  height={512}
                />
              </button>{" "}
              <button onClick={() => switchChain(Mumbai.chainId)}>
                Mumbai
              </button>{" "}
              <button onClick={() => switchChain(AvalancheFuji.chainId)}>
                AvalancheFuji
              </button>{" "}
              <button onClick={() => switchChain(BaseGoerli.chainId)}>
                BaseGoerli
              </button>{" "}
              <button onClick={() => switchChain(OptimismGoerli.chainId)}>
                Sepolia
              </button>{" "}
              <button onClick={() => switchChain(Sepolia.chainId)}>
                OptimismGoerli
              </button>{" "}
              <button onClick={() => switchChain(BinanceTestnet.chainId)}>
                BinanceTestnet
              </button>{" "}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
