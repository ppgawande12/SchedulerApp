import React from "react";

const IndexPage = () => {
  return (
    <div className=" flex justify-center mt-10">
      <a
        href="/login"
        class="text-white w-28 bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Login
      </a>
      <a
        href="/signup"
        class="text-white w-28 bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Sign Up
      </a>
    </div>
  );
};

export default IndexPage;
