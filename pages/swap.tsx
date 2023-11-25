// `app/page.tsx` is the UI for the `/` URL
import SwapContainer from "../containers/swapConatiner";
import Navbar from "@/components/nav/navbar";
import { useSelector } from "react-redux";

import { selectActiveChain } from "@/redux/features/todo-slice";
export default function Swap() {
  const activeChain = useSelector(selectActiveChain);

  // Now, `activeChain` contains the value of `activeChain` from the Redux store
  // You can use it as needed in your component
  console.log("activeChain", activeChain);

  return (
    <div className={`container mx-auto`}>
      <Navbar />
      <SwapContainer />
    </div>
  );
}
