import React, { useState } from "react";
import { useSwitchChain, useChain } from "@thirdweb-dev/react";
import { Dropdown } from "flowbite-react";
import { bscTestnet, polygonMumbai } from "wagmi/chains";

export default function SecondNetworkDropdown() {
  const switchChain = useSwitchChain();
  const chain = useChain();

  const [selectedChain, setSelectedChain] = useState();

  return (
    <div>
      <Dropdown
        label={chain?.name ? chain?.name : `Connect Wallet`}
        dismissOnClick={false}
      >
        <Dropdown.Item
          value="Mumbai"
          onClick={() => switchChain(polygonMumbai.id)}
        >
          Mumbai
        </Dropdown.Item>{" "}
        <Dropdown.Item
          value="BinanceTestnet"
          onClick={() => switchChain(bscTestnet.id)}
        >
          BinanceTestnet
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
}
