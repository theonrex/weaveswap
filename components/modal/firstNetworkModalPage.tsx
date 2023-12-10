import React, { useState, useEffect } from "react";
import { bscTestnet, polygonMumbai } from "wagmi/chains";
import { useNetwork } from "wagmi";

import { Modal } from "flowbite-react";
import styles from "./modal.module.css";
import Image from "next/image";
import dropDownIcon from "../../assets/png/dropdownIcon.png";
import { useAppDispatch } from "@/redux/hooks";
import { setActiveChain } from "@/redux/features/activeChain";
import { useSwitchNetwork } from "wagmi";

import { ChainType } from "@/types/chainType";

// Array to store chain options
const ChainOptions = [
  { id: polygonMumbai.id, name: "Mumbai" },

  {
    id: bscTestnet.id,
    name: "BinanceTestnet",
    icon: bscTestnet,
  },
];

const FirstNetworkModal: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useAppDispatch();
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  console.log("log", chain);

  // Function to render the connection status based on the network status
  const renderConnectionStatus = () => {
    return chain ? <h4>{chain?.name}</h4> : <h4>Unsupported network</h4>;
  };
  // console.log(chain);
  // console.log(Sepolia.id);

  return (
    <div>
      {/* Button to open the modal */}
      <button onClick={() => setOpenModal(true)} className={styles.activeChain}>
        {/* <MediaRenderer src={chain?.icon?.url} /> */}
        {renderConnectionStatus()}

        <Image
          className={styles.dropDownIcon}
          src={dropDownIcon}
          width={20}
          height={20}
          alt="Dropdown Image"
        />
      </button>
      {/* Modal for selecting a chain */}
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
            {/* Display the active chain in the modal */}
            <button className={styles.activeChain}>
              {/* <MediaRenderer src={chain?.icon?.url} /> */}
              {renderConnectionStatus()}
            </button>
            {/* Display available chain options */}
            <div className={styles.SwitchChains}>
              {ChainOptions.map((option) => (
                <div>
                  <button
                    disabled={!switchNetwork || option.id === chain?.id}
                    key={option.id}
                    onClick={() => switchNetwork?.(option.id)}
                  >
                    {option.name}
                    {isLoading &&
                      pendingChainId === option.id &&
                      " (switching)"}
                  </button>
                </div>
              ))}
              <div>{error && error.message}</div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FirstNetworkModal;
