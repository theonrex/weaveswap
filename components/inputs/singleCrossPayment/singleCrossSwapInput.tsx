import React, { useState, useEffect } from "react";
import TokensDropdown from "../../dropdown/tokensDropdown";
import styles from "./singleswap.module.css";
import { useContractRead } from "wagmi";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

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
import { useSelector } from "react-redux";
import { selectActiveChain } from "@/redux/features/activeChain";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount } from "wagmi";
import { useNetwork } from "wagmi";
import {
  Polygon_Mumbai_SourceChainSenderAbi,
  BSC_Testnet_SourceChainSenderAbi,
} from "@/constants/ABI/sourceChainAbi";
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
  const [amount, setAmount] = useState<number>();
  const [_value, setValue] = useState(0.0);
  const [destinationState, setDestinationState] = useState("");
  const [chainReceiver, setChainReceiver] = useState("");
  const [allowanceCheckContract, setAllowanceCheckContract] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [checkSourceChain, setCheckSourceChain] = useState("");
  const [allowanceAbi, setAllowanceAbi] = useState({});
  const [sourceChainAbi, setSourceChainAbi] = useState({});
  const [loading, setLoading] = useState(false);

  // const address = useAddress();
  const _owner = address;
  const funder = address;

  const feeToken = 1;
  const to = address;
  const activeChain = chain;
  const secondChain = isClient ? localStorage.getItem("secondChain") : "";

  useEffect(() => {
    console.log("activeChain", activeChain?.name);
    console.log("secondChain", secondChain);
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
  //read contracts
  //allowance
  const {
    data: allowanceData,
    isError,
    isLoading,
  } = useContractRead({
    address: allowanceCheckContract,
    abi: allowanceAbi,
    functionName: "allowance",
    args: [_owner, _spender],
  });

  const { data: getFunderBalance } = useContractRead({
    address: checkSourceChain,
    abi: sourceChainAbi,
    functionName: "getFunderBalance",
    args: [funder],
  });
  console.log("allowanceCheckContract", allowanceCheckContract);
  console.log("allowanceAbi", allowanceAbi);
  console.log("_owner", _owner);
  console.log("checkSourceChain", checkSourceChain);
  console.log("getFunderBalance", getFunderBalance?.toString());
  //write contracts

  const { config } = usePrepareContractWrite({
    address: checkSourceChain,
    abi: sourceChainAbi,
    functionName: "fund",
    args: [amount],
  });
  const { data, isSuccess, write: fundContract } = useContractWrite(config);

  const { config: sendMessage } = usePrepareContractWrite({
    address: checkSourceChain,
    abi: sourceChainAbi,
    functionName: "sendMessage",
    args: [destinationState, chainReceiver, feeToken, to, amount],
  });
  const {
    data: callSendMessageData,
    isLoading: callSendMessageLoading,
    isSuccess: callSendMessageSuccess,
    write: callSendMessage,
  } = useContractWrite(sendMessage);

  useEffect(() => {
    const ethers = require("ethers");
    if (allowanceData) {
      const bigNumber = ethers.BigNumber.from(allowanceData);
      const formatted = ethers.utils.formatUnits(bigNumber, 6);
      setFormattedNumber(formatted);
    } else {
      console.error("allowanceData._hex is undefined");
    }

    if (getFunderBalance) {
      const bigNumber = ethers.BigNumber.from(getFunderBalance);
      const formattedFunderBalance = ethers.utils.formatUnits(bigNumber, 6);
      setGetFunderBalanceNumber(formattedFunderBalance);
    } else {
      console.error("allowanceData._hex is undefined");
    }
  }, [formattedNumber, _owner, checkSourceChain, getFunderBalanceNumber]);
  console.log("formattedNumber", formattedNumber);
  console.log("getFunderBalanceNumber", getFunderBalanceNumber);
  console.log("amount", amount);
  console.log("allowanceData", allowanceData);
  console.log("amount", amount);
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
                  className={styles.crossChainBtn}
                  onClick={callSendMessage}
                  disabled={loading}
                >
                  Swap
                </button>
              </div>
            ) : (
              <div>
                {getFunderBalanceNumber && getFunderBalanceNumber >= amount ? (
                  <button
                    className={styles.crossChainBtn}
                    onClick={callSendMessage}
                    disabled={loading}
                  >
                    Swap
                  </button>
                ) : formattedNumber && formattedNumber >= amount ? (
                  <div>
                    <button
                      className={styles.crossChainBtn}
                      onClick={fundContract}
                      disabled={loading}
                    >
                      Fund
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
