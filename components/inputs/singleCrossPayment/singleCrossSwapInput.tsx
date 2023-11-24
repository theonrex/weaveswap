import React, { useState, useEffect } from "react";
import TokensDropdown from "../../dropdown/tokensDropdown";
import styles from "./singleswap.module.css";
import {
  useContract,
  useContractWrite,
  useContractRead,
} from "@thirdweb-dev/react";
import {
  Polygon_Mumbai_SourceChainSender,
  Mumbai_Approve_contract,
  Eth_Sepolia_DestChainReceiver,
} from "@/constants/address";
import { useAddress } from "@thirdweb-dev/react";
import ApproveModalPage from "@/components/modal/approve/approveModal";
import { ethers } from "ethers";
//import { useContractRead } from "wagmi";

export default function SingleCrossSwapInput() {
  // Declare formattedNumber as a state variable
  const [formattedNumber, setFormattedNumber] = useState<number | undefined>(
    undefined
  );

  const [getFunderBalanceNumber, setGetFunderBalanceNumber] = useState<
    number | undefined
  >(undefined);
  // State to manage the input value
  const [amount, setAmount] = useState<number>(0.0);
  const [_value, setValue] = useState(0.0);
  const address = useAddress();

  console.log(amount);
  const _owner = address;
  const funder = address;

  const _spender = Polygon_Mumbai_SourceChainSender;

  const { contract } = useContract(Polygon_Mumbai_SourceChainSender);
  const { mutateAsync: fund } = useContractWrite(contract, "fund");

  // const { contract: allowanceContract } = useContract(
  //   "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
  // );
  const fundContract = async () => {
    try {
      const data = await fund({ args: [amount] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  //sendMessage
  const destinationChainSelector = "16015286601757825753";
  const receiver = Eth_Sepolia_DestChainReceiver;
  const feeToken = 1;
  const to = address;

  const { contract: sendMessageContract } = useContract(
    "0xc31E4DB93B3C7c8d0F186cDeefB59703A946ce05"
  );
  const { mutateAsync: sendMessage, isLoading } = useContractWrite(
    contract,
    "sendMessage"
  );
  const callSendMessage = async () => {
    try {
      const data = await sendMessage({
        args: [destinationChainSelector, receiver, feeToken, to, amount],
      });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };
  //function to check if the user has given the contract enought allowance
  const { contract: allowanceCheck } = useContract(
    "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
  );
  const { data: allowanceData } = useContractRead(allowanceCheck, "allowance", [
    _owner,
    _spender,
  ]);

  //function to check if the user has given the contract enought allowance
  const { contract: getFunderBalanceData } = useContract(
    Polygon_Mumbai_SourceChainSender
  );
  const { data: getFunderBalance } = useContractRead(
    getFunderBalanceData,
    "getFunderBalance",
    [funder]
  );
  useEffect(() => {
    const ethers = require("ethers");
    if (allowanceData?._hex) {
      const bigNumber = ethers.BigNumber.from(allowanceData._hex);
      const formatted = ethers.utils.formatUnits(bigNumber, 6);
      setFormattedNumber(formatted);

      console.log(formattedNumber);
    } else {
      console.error("allowanceData._hex is undefined");
    }

    if (getFunderBalance?._hex) {
      const bigNumber = ethers.BigNumber.from(getFunderBalance._hex);
      const formattedFunderBalance = ethers.utils.formatUnits(bigNumber, 6);
      setGetFunderBalanceNumber(formattedFunderBalance);

      console.log(formattedFunderBalance);
    } else {
      console.error("allowanceData._hex is undefined");
    }

    console.log("allowanceData", formattedNumber);
  }, [formattedNumber, _owner, _spender, getFunderBalanceNumber]);

  console.log("getFunderBalanceNumber", getFunderBalanceNumber);
  console.log("allowanceData", formattedNumber);
  console.log("amount", amount);
  // getFunderBalanceNumber 0.000004
  //  allowanceData 999999999999.999995
  //  amount 6.666666666666667e+24
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
        <div>
          <TokensDropdown />
        </div>
      </div>
      <div className={styles.crossChainBctn}>{}</div>
      <div className={styles.crossChainBtnc}>
        {getFunderBalanceNumber &&
        getFunderBalanceNumber >= amount &&
        formattedNumber &&
        formattedNumber >= amount ? (
          <div>
            {/* Display the "Continue" button */}
            <button className={styles.crossChainBtn} onClick={callSendMessage}>
              Swap
            </button>{" "}
          </div>
        ) : (
          <div>
            {getFunderBalanceNumber && getFunderBalanceNumber >= amount ? (
              // Display the "Fund" button
              <button
                className={styles.crossChainBtn}
                onClick={callSendMessage}
              >
                swap
              </button>
            ) : formattedNumber && formattedNumber >= amount ? (
              // Display the "Allowance" button
              <button className={styles.crossChainBtn} onClick={fundContract}>
                Fund
              </button>
            ) : (
              // Display the message to fund with the given input
              <ApproveModalPage />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
