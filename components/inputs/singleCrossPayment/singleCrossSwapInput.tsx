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
import { Tooltip } from "flowbite-react";
import { useSelector } from "react-redux";
import { selectActiveChain } from "@/redux/features/activeChain";
import { selectSecondChain } from "@/redux/features/selectedChain";

export default function SingleCrossSwapInput() {
  // Declare formattedNumber as a state variable
  const [formattedNumber, setFormattedNumber] = useState<number | undefined>(
    undefined
  );

  const [getFunderBalanceNumber, setGetFunderBalanceNumber] = useState<
    number | undefined
  >(undefined);
  // State to manage the input value
  const [amount, setAmount] = useState<number>();
  const [_value, setValue] = useState(0.0);
  const [destinationState, setDestinationState] = useState("");
  const [chainReceiver, setChainReceiver] = useState("");

  const address = useAddress();

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
  const activeChain = useSelector(selectActiveChain);
  const secondChain = useSelector(selectSecondChain);

  console.log("secondChain", secondChain);
  console.log("activeChain", activeChain);

  //check receiver
  useEffect(() => {
    if (activeChain?.chain === "mumbai" && secondChain === "sepolia") {
      const destinationChainSelector = "16015286601757825753";
      const receiver = Eth_Sepolia_DestChainReceiver;
      setDestinationState(destinationChainSelector);
      setChainReceiver(receiver);
    } else if (activeChain?.chain === "AVAX" && secondChain === "sepolia") {
      const destinationChainSelector = "16015286601757825753";
      const receiver = "0x04B8C373e97a906e23d11123f047b2E2342cd9F1";
      setDestinationState(destinationChainSelector);
      setChainReceiver(receiver);
    } else {
      console.log("wrong network");
    }
  });

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
  // console.log("allowanceData", formattedNumber);
  // console.log("getFunderBalanceNumber", getFunderBalanceNumber);
  // console.log("amount", amount);

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
                {/* Display the "Continue" button */}
                <button
                  className={styles.crossChainBtn}
                  onClick={callSendMessage}
                >
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
                  <div>
                    <button
                      className={styles.crossChainBtn}
                      onClick={fundContract}
                    >
                      Fund
                    </button>
                    <div className={styles.Tooltip_body}>
                      <Tooltip
                        className={styles.Tooltip}
                        content="
                        When users use Uniswap, Rhino, Sushiswap, or Aave, the platform will require users to first transfer tokens from their wallets to a contract, and then hand over another token of equal value to the user.                        
                        "
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
