import React, { useState } from "react";
import { useChain, Chain } from "@thirdweb-dev/react";
import { Dropdown } from "flowbite-react";
import {
  Sepolia,
  OptimismGoerli,
  BinanceTestnet,
  BaseGoerli,
  AvalancheFuji,
  Mumbai,
} from "@thirdweb-dev/chains";
import { Button, Modal } from "flowbite-react";

export default function SecondNetworkModal() {
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

  const [openModal, setOpenModal] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpenModal(true)}>Toggle modal</Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Terms Service</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              With less than a month to go before the European Union enacts new
              consumer privacy laws for its citizens, companies around the world
              are updating their terms of service agreements to comply.
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              The European Union’s General Data Protection Regulation (G.D.P.R.)
              goes into effect on May 25 and is meant to ensure a common set of
              data rights in the European Union. It requires organizations to
              notify users as soon as possible of high-risk data breaches that
              could personally affect them.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>I accept</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Dropdown component for selecting different blockchain networks */}
      <Dropdown
        label={selectedChain ? String(selectedChain) : `Connect Wallet`}
        dismissOnClick={false}
      >
        {/* Individual items in the dropdown for each blockchain network */}
        <Dropdown.Item
          value="Sepolia"
          onClick={() => handleSelectChange(Sepolia.name)}
        >
          Sepolia
        </Dropdown.Item>
        <Dropdown.Item
          value="Mumbai"
          onClick={() => handleSelectChange(Mumbai.name)}
        >
          Mumbai
        </Dropdown.Item>
        <Dropdown.Item
          value="AvalancheFuji"
          onClick={() => handleSelectChange(AvalancheFuji.name)}
        >
          AvalancheFuji
        </Dropdown.Item>
        <Dropdown.Item
          value="BaseGoerli"
          onClick={() => handleSelectChange(BaseGoerli.name)}
        >
          OptimismGoerli
        </Dropdown.Item>
        <Dropdown.Item
          value="OptimismGoerli"
          onClick={() => handleSelectChange(OptimismGoerli.name)}
        >
          OptimismGoerli
        </Dropdown.Item>
        <Dropdown.Item
          value="BinanceTestnet"
          onClick={() => handleSelectChange(BinanceTestnet.name)}
        >
          BinanceTestnet
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
}
