import React, { useState } from "react";
import { useChain, Chain } from "@thirdweb-dev/react";
import { Dropdown } from "flowbite-react";
import { bscTestnet, polygonMumbai } from "wagmi/chains";
import styles from "./dropdown.module.css";

export default function TokensDropdown() {
  // Custom hook to get information about the current blockchain network
  const chain = useChain();

  // State to keep track of the selected chain
  const [selectedChain, setSelectedChain] = useState<string | undefined>(
    undefined
  );

  // Handler for the selection change in the dropdown
  const handleSelectChange = (value: string) => {
    // Update the selectedChain state with the chosen value
    setSelectedChain(value);
  };
  return (
    <div className={styles.TokensDropdown}>
      {/* Dropdown component for selecting different blockchain networks */}
      <Dropdown
        label={selectedChain ? String(selectedChain) : `Connect Wallet`}
        dismissOnClick={false}
        className={styles.TokensDropdown_Button}
      >
        {/* Individual items in the dropdown for each blockchain network */}
        <Dropdown.Item
          value="Binance"
          onClick={() => handleSelectChange(bscTestnet.name)}
        >
          Link
        </Dropdown.Item>
        <Dropdown.Item
          value="Mumbai"
          onClick={() => handleSelectChange(polygonMumbai.name)}
        >
          Mumbai
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
}
