"use client";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
function Login() {
  const router = useRouter();
  const REACT_APP_API_URL = "https://scheduale-api.azurewebsites.net";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      console.log("click");
      try {
        console.log("click");
        const response = await fetch(`${REACT_APP_API_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error);
        }

        const cookie = Cookies.set("access_token", result.user._id);

        toast.success("Login Successful");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } catch (error) {
        toast.error(error.message);
      }
    },
    [formData, REACT_APP_API_URL, router]
  );

  return (
    <>
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

      <form className="m-auto w-96 mt-10">
        <h1 className="text-2xl text-center">Login</h1>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Your email" />
          </div>
          <TextInput
            id="email"
            value={formData.email}
            onChange={handleChange}
            name="email"
            type="email"
            placeholder="Enter Email"
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="Your password" />
          </div>
          <TextInput
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Enter password"
            required
          />
        </div>

        <Button
          onClick={submit}
          type="submit"
          className="text-white w-full text-center m-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-2xl mt-5 pl-5 pr-5 me-2 mb-2"
        >
          Login
        </Button>
        <p>
          Don&apos;t have an account
          <Link className="text-indigo-600 ml-1" href="/signup">
            Sign Up
          </Link>
        </p>
      </form>
    </>
  );
}

export default Login;
