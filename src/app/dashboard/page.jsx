"use client";
import { Card } from "flowbite-react";
import React, { useEffect, useState, useMemo } from "react";
import cookieValue from "../get_accsses_token";
import NavbarMenu from "../Navbar";
import "react-toastify/dist/ReactToastify.css";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const REACT_APP_API_URL = useMemo(() => "https://scheduale-api.azurewebsites.net", []);
  const authorization = useMemo(() => cookieValue, []);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${REACT_APP_API_URL}/posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization,
          },
        });

        const result = await response.json();
        if (response.ok) {
          setPosts(result);
        } else {
          throw new Error(result.error || "Unexpected response format");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [REACT_APP_API_URL, authorization]);

  return (
    <>
      <NavbarMenu token={authorization} />
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <span className="loader"></span>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post, index) => (
            <Card key={index} style={{ marginBottom: 16 }} className="max-w-sm text-start w-1/2">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Post Title: {post.title}
              </h2>
              <div className="text-normal h-1/2 overflow-scroll tracking-tight  text-gray-900 dark:text-white">
                Post Content: <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
              <h5 className="text-normal tracking-tight text-gray-900 dark:text-white">
                Receivers Email: {post.email}
              </h5>
              <h5 className="text-normal tracking-tight text-gray-900 dark:text-white">
                Post Schedule Date: {post.scheduleDate}
              </h5>
              <h5 className="text-normal tracking-tight text-gray-900 dark:text-white">
                Post Schedule Time: {post.scheduleTime}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400"></p>
            </Card>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </>
  );
};

export default PostList;
