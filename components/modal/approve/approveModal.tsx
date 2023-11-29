import React, { useState, useEffect } from "react";
import { useChain } from "@thirdweb-dev/react";
import styles from "./approve.module.css";
import Image from "next/image";
import { MediaRenderer } from "@thirdweb-dev/react";
import dropDownIcon from "../../assets/png/dropdownIcon.png";
import { useContract, useContractWrite } from "@thirdweb-dev/react";
import {
  Polygon_Mumbai_SourceChainSender,
  Mumbai_Approve_contract,
  Sepolia_to_mumbai_SourceChainSender,
  Sepolia_contract,
} from "@/constants/address";
import { Tooltip, Modal } from "flowbite-react";
import { useSelector } from "react-redux";
import { selectActiveChain } from "@/redux/features/activeChain";
import { selectSecondChain } from "@/redux/features/selectedChain";

export default function ApproveModalPage() {
  const chain = useChain();

  const [openModal, setOpenModal] = useState(false);

  // State to manage the input value
  const [_value, setValue] = useState<number>(0.0);
  //sendMessage
  const activeChain = useSelector(selectActiveChain);
  const secondChain = useSelector(selectSecondChain);
  const [spender, setSpender] = useState("");
  const [approve_contract, setApprove_contract] = useState("");

  //check receiver
  useEffect(() => {
    if (activeChain?.chain === "mumbai" && secondChain === "sepolia") {
      const approve = Mumbai_Approve_contract;
      const _spender = Polygon_Mumbai_SourceChainSender;
      setSpender(_spender);
      setApprove_contract(approve);
    } else if (activeChain?.chain === "sepolia" && secondChain === "mumbai") {
      const approve = Sepolia_contract;
      const _spender = Sepolia_to_mumbai_SourceChainSender;
      setSpender(_spender);
      setApprove_contract(approve);
    } else {
      console.log("wrong network");
    }
  }, [spender, approve_contract]);

  console.log("spender", spender);
  console.log("approve_contract", approve_contract);

  const { contract } = useContract(approve_contract);
  const { mutateAsync: approve } = useContractWrite(contract, "approve");

  const call = async () => {
    try {
      const data = await approve({ args: [spender, _value] });
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
      <div className={styles.Tooltip_body}>
        <Tooltip
          className={styles.Tooltip}
          content="As per the ERC-20 protocol, a standard developed by the official Ethereum team, users engaging in swap or cross-chain bridge services (e.g., Uniswap, Rhino, Sushiswap) will encounter an approval window when trading ERC-20 tokens. This authorization step ensures adherence to protocol standards and facilitates secure and standardized token transactions. "
          arrow={false}
        >
          <div className={styles.whyApprove}> Why Approve?</div>
        </Tooltip>
      </div>
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
