import React, { useState } from "react";
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

export default function SingleCrossSwapInput() {
  // State to manage the input value
  const [amount, setAmount] = useState(0.0);
  const [_value, setValue] = useState(0.0);
  const address = useAddress();

  const _owner = address;

  const _spender = Polygon_Mumbai_SourceChainSender;

  const { contract } = useContract(Polygon_Mumbai_SourceChainSender);
  const { mutateAsync: fund } = useContractWrite(contract, "fund");

  // const { contract: allowanceContract } = useContract(
  //   "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
  // );
  const call = async () => {
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
  const feeToken = "";
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
  return (
    <div>
      <div className={styles.crossInputBody}>
        <div className={styles.swapInputBody}>
          <label htmlFor="success" className={styles.swapLabel}>
            You Pay
          </label>
          <input
            type="text"
            name="quantity"
            defaultValue={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={styles.swapInput}
          />
        </div>
        <div>
          <TokensDropdown />
        </div>
      </div>
      <div className={styles.crossChainBtn}>
        {" "}
        <button onClick={call}>Fund</button>{" "}
      </div>
      <div className={styles.crossChainBtn}>
        {" "}
        <ApproveModalPage />
      </div>
    </div>
  );
}
