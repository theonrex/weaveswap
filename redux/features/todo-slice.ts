// chainSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Mumbai } from "@thirdweb-dev/chains";

interface ChainState {
  activeChain: typeof Mumbai | null;
}

const initialState: ChainState = {
  activeChain: null,
};

export const chainSlice = createSlice({
  name: "chain",
  initialState,

  reducers: {
    setActiveChain: (state, action: PayloadAction<typeof Mumbai | null>) => {
      state.activeChain = action.payload;
    },
  },
});

export const { setActiveChain } = chainSlice.actions;

export const selectActiveChain = (state: RootState) => state.chain.activeChain;

export default chainSlice.reducer;
