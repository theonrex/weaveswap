import { configureStore } from "@reduxjs/toolkit";
import chainSlice from "./features/todo-slice";

export const store = configureStore({
  reducer: {
    chain: chainSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
