import { useEffect, useRef, useState } from "react";
import { Button, TextInput } from "flowbite-react";
// import { useQuill } from "react-quilljs";
// import "quill/dist/quill.snow.css";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import cookieValue from "./get_access_token";
import NavbarMenu from "./NavbarMenu";
import "./loader.css";
import "react-toastify/dist/ReactToastify.css";

const PostForm = () => {
  // const { quill, quillRef } = useQuill();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const REACT_APP_API_URL = "https://schedule-rapp.onrender.com/";

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
  ];
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };
  const quillRef = useRef(null);

  useEffect(() => {
    console.log(content);
    const quill = quillRef.current?.getEditor();
    if (quill) {
      quill.on("text-change", () => {
        setContent(quill.root.innerHTML);
      });
      quill.getModule("toolbar").addHandler("image", selectLocalImage);
    }
  }, [content]);

  const selectLocalImage = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        setIsLoading(true);
        const file = input.files[0];
        const formData = new FormData();
        formData.append("file", file);
        const uploadUrl = `${REACT_APP_API_URL}upload`;

        try {
          const response = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Image upload failed.");
          }

          const data = await response.json();
          const imageUrl = data.url;
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, "image", imageUrl);
        } catch (error) {
          toast.error(error.message);
        } finally {
          setIsLoading(false);
        }
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${REACT_APP_API_URL}posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: cookieValue,
        },
        body: JSON.stringify({
          title,
          content,
          image,
          email,
          scheduleDate,
          scheduleTime,
        }),
      });
      const result = await response.json();
      console.log(result);
      if (!response.ok) {
        throw new Error("Failed to create post.");
      }

      toast.success("Post created successfully.");
      setTimeout(() => {
        toast.success("Check your post in the dashboard section.");
        window.location.href = "/dashboard";
      }, 2000);
    } catch (error) {
      toast.error(error.message);
    }

    // Reset form
    setTitle("");
    setContent("");
    setImage(null);
    setScheduleDate("");
    setScheduleTime("");
    setEmail("");
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <span className="loader"></span>
        </div>
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
      />
      <NavbarMenu />
      <form onSubmit={handleSubmit} className="w-2/4 m-auto mt-10 text-start">
        <h1 className="text-3xl flex justify-center">Create New Post</h1>

        <label
          htmlFor="title"
          className="block mt-3 mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Post Title
        </label>
        <TextInput
          id="title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />

        <label
          htmlFor="content"
          className="block mt-3 mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Post Content
        </label>
        <div className="h-96 overflow-scroll">
          {/* <div ref={quillRef} /> */}
          <ReactQuill
            ref={quillRef}
            theme="snow"
            modules={modules}
            formats={formats}
            value={content}
            onChange={setContent}
            className="h-96
            "
          />
        </div>

        <div className="mt-5">
          <label
            htmlFor="email"
            className="block mt-3 mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email of Receiver
          </label>
          <TextInput
            id="email"
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
              htmlFor="date"
              className="block mt-3 mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select Date:
            </label>
            <input
              type="date"
              id="date"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block mt-3 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              required
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="time"
              className="block mt-3 mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select Time:
            </label>
            <input
              type="time"
              id="time"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block mt-3 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              required
            />
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
