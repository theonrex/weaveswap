// Import necessary libraries and components
import React, { useState, useEffect } from "react";
import styles from "./approve.module.css";
import { useContractWrite } from "wagmi";
import {
  Polygon_Mumbai_SourceChainSender,
  Mumbai_Approve_contract,
  BSC_Testnet_to_Eth_Sepolia_SourceChainSender,
  BSC_Testnet_Approve_contract,
} from "@/constants/address";
import { Tooltip, Modal } from "flowbite-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import { Spinner } from "flowbite-react";
import { useNetwork } from "wagmi";
import {
  PolygonMumbaiAlowanceABi,
  BSC_Testnet_to_Eth_Sepolia_SourceChainSenderABI,
} from "@/constants/ABI/allowance";

// Main component
export default function ApproveModalPage() {
  // Retrieve the active chain
  const { chain } = useNetwork();

  // State variables
  const [openModal, setOpenModal] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [spender, setSpender] = useState("");
  const [approve_contract, setApproveContract] = useState("");
  const [loading, setLoading] = useState(false);
  const [allowanceAbi, setAllowanceAbi] = useState<any>();

  // Effect to determine spender and approval contract based on the active chain
  useEffect(() => {
    if (chain?.name) {
      const activeChainName = chain?.name.trim();

      if (activeChainName.includes("Polygon Mumbai")) {
        setApproveContract(Mumbai_Approve_contract);
        setSpender(Polygon_Mumbai_SourceChainSender);
        setAllowanceAbi(PolygonMumbaiAlowanceABi);
      } else if (activeChainName.includes("Binance Smart Chain Testnet")) {
        setSpender(BSC_Testnet_to_Eth_Sepolia_SourceChainSender);
        setApproveContract(BSC_Testnet_Approve_contract);
        setAllowanceAbi(BSC_Testnet_to_Eth_Sepolia_SourceChainSenderABI);
      } else {
        console.log("Wrong network");
      }
    }
  }, [chain]);

  // Contract hooks allowanceAbi
  const _valueString = amount;

  let _value: ethers.BigNumber = ethers.BigNumber.from(0);
  if (_valueString && !isNaN(Number(_valueString))) {
    const numericValue = Number(_valueString);
    _value = ethers.utils.parseUnits(numericValue.toString(), "ether");
  } else {
    console.error("Invalid amount input:", _valueString);
  }
  const handleTransactionResult = (result: string) => {
    if (result) {
      // Transaction initiated successfully
      toast.info("Transaction initiated. Please wait for confirmation.");
    } else if (isSuccess) {
      toast.success("Transaction initiated. Please wait for confirmation.");
    } else {
      // Transaction failed
      toast.error("Transaction failed. Please try again.");
    }
  };
  const _spender = spender;

  const { isLoading, isSuccess, isError, write } = useContractWrite({
    address: `${approve_contract}` as `0x${string}`,
    abi: allowanceAbi,
    functionName: "approve",
    args: [_spender, _value],
    onError: (isError) => {
      console.error("Error during transaction:", isError);
      toast(`Transaction failed. Please try again. ${isError.message}`);
      setLoading(false);
    },
  });

  useEffect(() => {
    if (isSuccess || isError) {
      setOpenModal(false);
      // Reset state when modal is closed
      setAmount(0);
    }
    if (isSuccess) {
      setOpenModal(false);
      toast(`Transaction Successful.`);
      setAmount(0);
    }
  }, [isSuccess, isError]);

  // Render component
  return (
    <div>
      {/* Button to open the modal */}
      <button onClick={() => setOpenModal(true)} className={styles.activeChain}>
        <h4>Approve</h4>{" "}
      </button>
      {/* Tooltip for additional information */}
      <div className={styles.Tooltip_body}>
        <Tooltip
          className={styles.Tooltip}
          content="As per the ERC-20 protocol, a standard developed by the official Ethereum team, users engaging in swap or cross-chain bridge services (e.g., Uniswap, Rhino, Sushiswap) will encounter an approval window when trading ERC-20 tokens. This authorization step ensures adherence to protocol standards and facilitates secure and standardized token transactions."
          arrow={false}
        >
          <div className={styles.whyApprove}> Why Approve?</div>
        </Tooltip>
      </div>
      {/* Modal for approving transaction */}
      <Modal
        className={styles.Modal}
        show={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header className={styles.ModalHeader}>
          <span> Approve</span>
        </Modal.Header>
        <Modal.Body className={styles.ModalBody}>
          <div className={styles.crossInputBody}>
            {/* Input for the amount to be approved */}
            <div className={styles.swapInputBody}>
              <label htmlFor="success" className={styles.swapLabel}>
                You Pay
              </label>
              <input
                name="quantity"
                defaultValue={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className={styles.swapInput}
              />
            </div>
            {/* Button to trigger contract call */}
            <div>
              <button
                className={
                  amount === 0 ||
                  isNaN(amount) ||
                  amount === null ||
                  amount === undefined
                    ? styles.disabled
                    : styles.approveBtn
                }
                onClick={async () => {
                  try {
                    setLoading(true);
                    // Manually invoke the write function
                    await write();

                    // Check if the transaction was successful and close the modal
                    if (isSuccess) {
                      setOpenModal(false);
                      // Reset state when modal is closed
                      setAmount(0);
                    }

                    console.log("Transaction completed successfully");
                  } catch (error: any) {
                    if (error?.name === "AbortError") {
                      console.warn("Transaction canceled by the user");
                    } else {
                      console.error("Error during transaction:", error);
                      toast.error(
                        `Transaction failed. Please try again. ${error.message}`
                      );
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={
                  loading ||
                  amount === 0 ||
                  isNaN(amount) ||
                  amount === null ||
                  amount === undefined
                }
              >
                {isLoading ? <Spinner /> : "Approve Token"}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* Toast container for displaying notifications */}
    </div>
  );
}
