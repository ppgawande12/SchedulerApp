import { Card } from "flowbite-react";
import React, { useEffect, useState } from "react";
import cookieValue from "./get_access_token";
import NavbarMenu from "./NavbarMenu";

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}posts`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            authorization: cookieValue,
          },
        });

        const result = await response.json();

        if (Array.isArray(result)) {
          setPosts(result);
        } else {
          console.error("Unexpected response format:", result);
        }
        if (!response.ok) {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    getData();
  }, []);

  return (
    <>
      <NavbarMenu />
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <Card
              key={post.id}
              style={{ marginBottom: 16 }}
              className="max-w-sm text-start w-1/2"
              imgAlt={post.title}
              imgSrc=""
            >
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Post Title: {post.post_title}
              </h2>
              <h5 className="text-normal tracking-tight text-gray-900 dark:text-white">
                Post Content: <div dangerouslySetInnerHTML={{ __html: post.post_content }} />
              </h5>
              <h5 className="text-normal tracking-tight text-gray-900 dark:text-white">
                Receivers Email: {post.receivers_email}
              </h5>
              <h5 className="text-normal tracking-tight text-gray-900 dark:text-white">
                Post Schedule Date: {post.schedule_date}
              </h5>
              <h5 className="text-normal tracking-tight text-gray-900 dark:text-white">
                Post Schedule Time: {post.schedule_time}
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
