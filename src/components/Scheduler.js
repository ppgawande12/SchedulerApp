"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Avatar, Dropdown, Navbar, Tabs } from "flowbite-react";
import { MdDashboard } from "react-icons/md";
import { HiClipboardList, HiUserCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import PostForm from "./PostForm";
import PostList from "./PostList";
import Profile from "./Profile";
import cookieValue from "./get_access_token";
const Scheduler = () => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(cookieValue);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    if (cookieValue) {
      setAccessToken(cookieValue);
    } else {
      navigate("/login");
    }
  }, [cookieValue]);

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
 
      <Tabs
        className="text-center flex justify-center mt-4"
        aria-label="Tabs with icons"
        variant="underline"
      >
        <Tabs.Item title="Dashboard" icon={MdDashboard}>
          <PostList />
        </Tabs.Item>

        <Tabs.Item title="Create New Post" icon={HiClipboardList}>
          <PostForm />
        </Tabs.Item>

        <Tabs.Item title="Profile" icon={HiUserCircle}>
          <Profile />
        </Tabs.Item>
      </Tabs>
    </div>
  );
};

export default Scheduler;
