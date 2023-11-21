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
import styles from "./approve.module.css";
import Image from "next/image";
import { MediaRenderer } from "@thirdweb-dev/react";
import dropDownIcon from "../../assets/png/dropdownIcon.png";
import { useContract, useContractWrite } from "@thirdweb-dev/react";
import {
  Polygon_Mumbai_SourceChainSender,
  Mumbai_Approve_contract,
} from "@/constants/address";

export default function ApproveModalPage() {
  const chain = useChain();

  const [openModal, setOpenModal] = useState(false);

  // State to manage the input value
  const [_value, setValue] = useState(0.0);

  const _spender = Polygon_Mumbai_SourceChainSender;

  const { contract } = useContract(Mumbai_Approve_contract);
  const { mutateAsync: approve } = useContractWrite(contract, "approve");

  const call = async () => {
    try {
      const data = await approve({ args: [_spender, _value] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  return (
    <div>
      <button onClick={() => setOpenModal(true)} className={styles.activeChain}>
        <MediaRenderer src={chain?.icon?.url} />
        <h4>Approve</h4>{" "}
      </button>
      <Modal
        className={styles.Modal}
        show={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header className={styles.ModalHeader}>
          <h2> Approve</h2>
          <p>
            Select a chain from our default list or search for a token by symbol
            or address.
          </p>
        </Modal.Header>
        <Modal.Body className={styles.ModalBody}>
          <div className={styles.crossInputBody}>
            <div className={styles.swapInputBody}>
              <label htmlFor="success" className={styles.swapLabel}>
                You Pay
              </label>
              <input
                type="text"
                name="quantity"
                defaultValue={_value}
                onChange={(e) => setValue(e.target.value)}
                className={styles.swapInput}
              />
            </div>
            <div>
              <button onClick={call}>callApprove</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
