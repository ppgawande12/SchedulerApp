import React, { useEffect, useState } from "react";
import { Button, FileInput, TextInput, Textarea } from "flowbite-react";

// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import cookieValue from "./get_access_token";
import NavbarMenu from "./NavbarMenu";
import "./loader.css";
import "react-toastify/dist/ReactToastify.css";

const PostForm = () => {
  const { quill, quillRef } = useQuill();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState([]);
  const [image, setImage] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const REACT_APP_API_URL = "https://schedule-rapp.onrender.com/";

  
  const selectLocalImage = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      setIsLoading(true);
      const file = input.files[0];
      const formData = new FormData();
      formData.append("file", file);
      // console.log(file);
      // Replace with your upload URL
      const uploadUrl = `${REACT_APP_API_URL}upload`;

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const imageUrl = data.url;

      const range = quill.getSelection();
      quill.insertEmbed(range.index, "image", imageUrl);
      setIsLoading(false);
    };
  };

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setContent(quill.root.innerHTML);
      });

      quill.getModule("toolbar").addHandler("image", () => {
        selectLocalImage();
      });
    }
  }, [quill]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${REACT_APP_API_URL}posts`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: cookieValue,
        },
        body: JSON.stringify({
          title: title,
          content: content,
          image: "",
          email: email,
          scheduleDate: scheduleDate,
          scheduleTime: scheduleTime,
        }),
      });
      // console.log(response);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }
      toast.success("Post created successfully." + result);
      setTimeout(() => {
        toast.success("Check your post in dashboard section");
        window.location.href = "/dashboard";
      }, 2000);
    } catch (error) {
      toast.error(error.message);
    }

    setImage(null);
    setScheduleDate(new Date());
  };

  return (
    <>
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <span class="loader "></span>
        </div>
      ) : (
        ""
      )}
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
        // transition:Bounce
      />
      <NavbarMenu />
      <form onSubmit={handleSubmit} className="w-2/4 m-auto mt-10 text-start">
        <h1 className="text-3xl flex justify-center">Create New Post</h1>

        <label
          for="file"
          class="block mt-3 mb-2 text-sm font-medium text-gray-900 dark:text-white mt-10"
        >
          Post Title
        </label>
        <TextInput
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <label for="file" class="block mt-3 mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Post Content
        </label>
        <div className="h-96 mb-3">
          <div ref={quillRef} value={content} onChange={(e) => setContent(e.target.value)} />
        </div>

        <div className="mt-20">
          <label
            for="email"
            class="block mt-3 mb-2 text-sm font-medium text-gray-900 dark:text-white mt-10"
          >
            Email of receiver
          </label>
          <TextInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
        </div>
        <div className="flex justify-between w-full">
          <div className="w-full">
            <label
              for="time"
              class="block mt-3 mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select Date:
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none"></div>
              <input
                type="date"
                id="date"
                class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block mt-3 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                min="09:00"
                max="18:00"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="w-full">
            <label
              for="time"
              class="block mt-3 mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select time:
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="time"
                id="time"
                class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block mt-3 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        <Button type="submit" variant="contained" className="m-auto mt-3">
          Save Post
        </Button>
      </form>
    </>
  );
};

export default PostForm;
