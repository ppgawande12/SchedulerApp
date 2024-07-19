import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import IndexPage from "./components/IndexPage";

import PostList from "./components/PostList";
import PostForm from "./components/PostForm";

function App() {
  return (
    <>
      <h1 className=" flex justify-center text-3xl mt-5 font-mono font-bold">Scheduler App</h1>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<IndexPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<PostList />} />
          <Route path="/createpost" element={<PostForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
