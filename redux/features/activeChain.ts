import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Mumbai } from "@thirdweb-dev/chains";

// Define the structure of the chain state
interface ChainState {
  activeChain: typeof Mumbai | null;
}

// Set the initial state for the chain slice
const initialState: ChainState = {
  activeChain: null,
};

// Create a Redux slice for the chain state
export const chainSlice = createSlice({
  name: "chain",
  initialState,

  // Define reducers for updating the chain state
  reducers: {
    // Reducer for setting the active chain
    setActiveChain: (state, action: PayloadAction<typeof Mumbai | null>) => {
      // Update the activeChain state
      state.activeChain = action.payload;

      // Update local storage based on the active chain
      if (action.payload) {
        // If an active chain is provided, store it in local storage
        localStorage.setItem("activeChain", action.payload);
      } else {
        // If no active chain is provided, remove the item from local storage
        localStorage.removeItem("activeChain");
      }
    },
  },
});

// Export the action creators
export const { setActiveChain } = chainSlice.actions;

// Select the active chain from the chain state
export const selectActiveChain = (state: RootState) => state.chain.activeChain;

// Export the chain reducer
export default chainSlice.reducer;
