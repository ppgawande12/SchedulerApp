"use client";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import IndexPage from "./IndexPage";

import PostList from "./PostList";
import PostForm from "./PostForm";


const RoutesFunction = () => {
  
  return (
    <>
      {" "}
     
      <div>
        <BrowserRouter>
         
          <Routes>
            <Route exact path="/" element={<IndexPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<PostList />} />
            <Route path="/createpost" element={<PostForm />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
};

export default RoutesFunction;
