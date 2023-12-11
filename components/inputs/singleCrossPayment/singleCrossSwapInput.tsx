import React, { useState, useEffect } from "react";
import TokensDropdown from "../../dropdown/tokensDropdown";
import styles from "./singleswap.module.css";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { ethers } from "ethers";
import {
  Polygon_Mumbai_SourceChainSender,
  Mumbai_Approve_contract,
  Eth_Sepolia_DestChainReceiver,
  BSC_Testnet_to_Eth_Sepolia_DestChainReceiver,
  BSC_Testnet_to_Eth_Sepolia_SourceChainSender,
  BSC_Testnet_Approve_contract,
} from "@/constants/address";
import {
  PolygonMumbaiAlowanceABi,
  BSC_Testnet_to_Eth_Sepolia_SourceChainSenderABI,
} from "@/constants/ABI/allowance";
import ApproveModalPage from "@/components/modal/approve/approveModal";
import { Tooltip } from "flowbite-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNetwork, useAccount, useContractRead } from "wagmi";
import {
  Polygon_Mumbai_SourceChainSenderAbi,
  BSC_Testnet_SourceChainSenderAbi,
} from "@/constants/ABI/sourceChainAbi";
import { Spinner } from "flowbite-react";

export default function SingleCrossSwapInput() {
  // Check if the code is running on the client side
  const { address, isConnecting, isDisconnected } = useAccount();
  const { chain, chains } = useNetwork();

  const isClient = typeof window !== "undefined";
  const [formattedNumber, setFormattedNumber] = useState<number | undefined>(
    undefined
  );
  const [getFunderBalanceNumber, setGetFunderBalanceNumber] = useState<
    number | undefined
  >(undefined);
  const [amount, setAmount] = useState<number>(1);
  const [chainReceiver, setChainReceiver] = useState<string | undefined>();
  const [destinationState, setDestinationState] = useState<string | undefined>(
    undefined
  );

  const [allowanceCheckContract, setAllowanceCheckContract] = useState<
    string | undefined
  >();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [checkSourceChain, setCheckSourceChain] = useState<
    string | undefined
  >();
  const [allowanceAbi, setAllowanceAbi] = useState<any>();
  const [sourceChainAbi, setSourceChainAbi] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  // const address = useAddress();
  const _owner = address;
  const funder = address;

  const feeToken = 1;
  const to = address;
  const activeChain = chain;
  const secondChain = isClient ? localStorage.getItem("secondChain") : "";

  useEffect(() => {
    if (
      activeChain?.name?.includes("Mumbai") &&
      secondChain?.includes("Sepolia")
    ) {
      setDestinationState("16015286601757825753");
      setChainReceiver(Eth_Sepolia_DestChainReceiver);
      setCheckSourceChain(Polygon_Mumbai_SourceChainSender);
      setAllowanceCheckContract(Mumbai_Approve_contract);
      setAllowanceAbi(PolygonMumbaiAlowanceABi);
      setSourceChainAbi(Polygon_Mumbai_SourceChainSenderAbi);
    } else if (
      activeChain?.name?.includes("Binance Smart Chain Testnet") &&
      secondChain?.includes("Sepolia")
    ) {
      setDestinationState("16015286601757825753");
      setChainReceiver(BSC_Testnet_to_Eth_Sepolia_DestChainReceiver);
      setCheckSourceChain(BSC_Testnet_to_Eth_Sepolia_SourceChainSender);
      setAllowanceCheckContract(BSC_Testnet_Approve_contract);
      setAllowanceAbi(BSC_Testnet_to_Eth_Sepolia_SourceChainSenderABI);
      setSourceChainAbi(BSC_Testnet_SourceChainSenderAbi);
    } else {
      setErrorMessage("wrong network");
      console.log("Wrong Network");
    }
  }, [activeChain, secondChain]);
  const _spender = checkSourceChain;

  const _valueString = amount;

  let _value: ethers.BigNumber = ethers.BigNumber.from(0);
  if (_valueString && !isNaN(Number(_valueString))) {
    const numericValue = Number(_valueString);
    _value = ethers.utils.parseUnits(numericValue.toString(), "ether");
  } else {
    console.error("Invalid amount input:", _valueString);
  }

  //read contracts
  //allowance
  const { data: allowanceData } = useContractRead({
    address: allowanceCheckContract as `0x${string}`,
    abi: allowanceAbi,
    functionName: "allowance",
    args: [_owner, _spender],
  });

  const { data: getFunderBalance } = useContractRead({
    address: checkSourceChain as `0x${string}`,
    abi: sourceChainAbi,
    functionName: "getFunderBalance",
    args: [funder],
  });

  //write contracts

  // const { config: sendMessage } = usePrepareContractWrite({
  //   address: checkSourceChain as `0x${string}`,
  //   abi: sourceChainAbi,
  //   functionName: "sendMessage",
  //   args: [destinationState, chainReceiver, feeToken, to, _value],
  // });
  // const {
  //   data: callSendMessageData,
  //   isLoading: callSendMessageLoading,
  //   isSuccess: callSendMessageSuccess,
  //   write: callSendMessage,
  //   isError: callSendMessageError,
  // } = useContractWrite(sendMessage);

  const {
    data: callSendMessageData,
    isLoading: callSendMessageLoading,
    isSuccess: callSendMessageSuccess,
    write: callSendMessage,
    isError: callSendMessageError,
  } = useContractWrite({
    address: checkSourceChain as `0x${string}`,
    abi: sourceChainAbi,
    functionName: "sendMessage",
    args: [destinationState, chainReceiver, feeToken, to, _value],
    onError: (isError) => {
      console.error("Error during transaction:", isError);
      toast(`Transaction failed. Please try again. ${isError.message}`);
      setLoading(false);
    },
  });

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    write: fundContract,
  } = useContractWrite({
    address: checkSourceChain as `0x${string}`,
    abi: sourceChainAbi,
    functionName: "fund",
    args: [_value],
    onError: (isError) => {
      console.error("Error during transaction:", isError);
      toast(`Transaction failed. Please try again. ${isError.message}`);
      setLoading(false);
    },
  });

  // const { config } = usePrepareContractWrite({
  //   address: checkSourceChain as `0x${string}`,
  //   abi: sourceChainAbi,
  //   functionName: "fund",
  //   args: [_value],
  // });
  // const {
  //   data,
  //   isLoading,
  //   isSuccess,
  //   isError,
  //   write: fundContract,
  // } = useContractWrite(config);

  useEffect(() => {
    const ethers = require("ethers");
    if (allowanceData) {
      const bigNumber = ethers.BigNumber.from(allowanceData);
      const formatted = ethers.utils.formatUnits(bigNumber, 6);
      setFormattedNumber(formatted);
    } else {
      console.error("allowanceData is undefined");
    }

    console.log(allowanceData);

    if (getFunderBalance) {
      const bigNumber = ethers.BigNumber.from(getFunderBalance);
      const formattedFunderBalance = ethers.utils.formatUnits(bigNumber, 6);
      setGetFunderBalanceNumber(formattedFunderBalance);
    } else {
      console.error("getFunderBalance is undefined");
    }
  }, [formattedNumber, _owner, checkSourceChain, getFunderBalanceNumber]);
  console.log(getFunderBalanceNumber);

  useEffect(() => {
    if (isError || callSendMessageError) {
      const errorMessage =
        typeof isError === "object"
          ? (isError as { message?: string }).message
          : undefined;
      toast(`Transaction failed. Please try again. ${errorMessage}`);
    } else {
      // Handle other cases or leave it empty if no specific handling is needed
    }

    if (isSuccess || callSendMessageSuccess) {
      toast.success(`Transaction Successful.`);
      setAmount(0);
    }
  }, [isSuccess, isError]);
  useEffect(() => {
    formattedNumber;
    getFunderBalanceNumber;
    amount;
  }, []);

  return (
    <div>
      <div className={styles.crossInputBody}>
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
        <div>{/* <TokensDropdown /> */}</div>
      </div>
      <div className={styles.crossChainBctn}>{}</div>
      <div className={styles.crossChainBtnc}>
        {Number.isNaN(amount) || amount === undefined || "" || null ? (
          <div>
            <div className={styles.errorMessage}>Fill in an amount</div>
          </div>
        ) : (
          <div>
            {getFunderBalanceNumber &&
            getFunderBalanceNumber >= amount &&
            formattedNumber &&
            formattedNumber >= amount ? (
              <div>
                <button
                  className={
                    amount === 0 ||
                    isNaN(amount) ||
                    amount === null ||
                    amount === undefined
                      ? styles.disabled
                      : styles.crossChainBtn
                  }
                  onClick={async () => {
                    try {
                      setLoading(true);
                      // Manually invoke the write function
                      await callSendMessage();

                      // Check if the transaction was successful and close the modal
                      if (callSendMessageSuccess) {
                        toast.success(`Transaction Successful.`);
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
                  disabled={callSendMessageLoading}
                >
                  {callSendMessageLoading ? <Spinner /> : " Swap"}
                </button>
              </div>
            ) : (
              <div>
                {getFunderBalanceNumber && getFunderBalanceNumber >= amount ? (
                  <button
                    className={
                      amount === 0 ||
                      isNaN(amount) ||
                      amount === null ||
                      amount === undefined
                        ? styles.disabled
                        : styles.crossChainBtn
                    }
                    onClick={async () => {
                      try {
                        setLoading(true);
                        // Manually invoke the write function
                        await callSendMessage();

                        // Check if the transaction was successful and close the modal
                        if (callSendMessageSuccess) {
                          toast.success(`Transaction Successful.`);

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
                    disabled={callSendMessageLoading}
                  >
                    {callSendMessageLoading ? <Spinner /> : " Swap"}
                  </button>
                ) : formattedNumber && formattedNumber >= amount ? (
                  <div>
                    <button
                      className={styles.crossChainBtn}
                      onClick={async () => {
                        try {
                          setLoading(true);
                          // Manually invoke the write function
                          await fundContract();

                          // Check if the transaction was successful and close the modal
                          if (isSuccess) {
                            toast.success(`Transaction Successful.`);

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
                      {isLoading ? <Spinner /> : " Fund"}
                    </button>
                    <div className={styles.Tooltip_body}>
                      <Tooltip
                        className={styles.Tooltip}
                        content="When users use Uniswap, Rhino, Sushiswap, or Aave, the platform will require users to first transfer tokens from their wallets to a contract, and then hand over another token of equal value to the user."
                        arrow={false}
                      >
                        <div className={styles.whyApprove}> Why Fund?</div>
                      </Tooltip>
                    </div>
                  </div>
                ) : (
                  <ApproveModalPage />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
