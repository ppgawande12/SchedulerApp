import "./App.css";
import { Button } from "flowbite-react";

import RoutesFunction from "./components/RoutesFunction";


function App() {
  return (
    <>
      <h1 className=" flex justify-center text-3xl mt-5 font-mono font-bold">Scheduler App</h1>

      <RoutesFunction />
    </>
  );
}

export default App;
