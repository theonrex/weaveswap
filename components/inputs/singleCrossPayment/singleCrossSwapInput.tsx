import React from "react";
import TokensDropdown from "../../dropdown/tokensDropdown";

export default function SingleCrossSwapInput() {
  return (
    <div>
      <div className="mb-6">
        <label
          htmlFor="success"
          className="block mb-2 text-sm font-medium text-green-700 dark:text-green-500"
        >
          You Pay
        </label>
        <input
          type="number"
          id="success"
          className="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
          placeholder="Success input"
        />
      </div>
      <div>
        <TokensDropdown />
      </div>
    </div>
  );
}
