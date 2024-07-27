"use client";
import { Button, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });
  const REACT_APP_API_URL = "https://scheduale-api.azurewebsites.net/";
  const handdleChange = (e) => {
    const { name, value } = e.target;
    setFormData((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    console.log("click");
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);
    try {
      const response = await fetch(`${REACT_APP_API_URL}register`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.fname,
          last_name: formData.lname,
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      const cookie = Cookies.set("access_token", result.insertedId);

      toast.success("Account Create Successfuly");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };
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
        // transition:Bounce
      />
      <form className="m-auto w-96 mt-10 ">
        <h1 className="text-2xl text-center"> Sign Up </h1>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="fname" value="Your First Name" />
          </div>
          <TextInput
            value={formData.fname}
            onChange={handdleChange}
            id="fname"
            name="fname"
            type="text"
            placeholder="Enter First Name"
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="lname" value="Your Last Name" />
          </div>
          <TextInput
            id="lname"
            value={formData.lname}
            onChange={handdleChange}
            name="lname"
            type="text"
            placeholder="Enter Last Name"
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Your email" />
          </div>
          <TextInput
            id="email"
            value={formData.email}
            onChange={handdleChange}
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
            onChange={handdleChange}
            type="password"
            placeholder="Enter password"
            required
          />
        </div>

        <Button
          onClick={submit}
          className="text-white w-full text-center m-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-2xl mt-5  pl-5 pr-5   me-2 mb-2"
        >
          Submit
        </Button>

        <p>
          Already have an account
          <Link className="text-indigo-600 ml-1" href="/login">
            Login
          </Link>
        </p>
      </form>
    </>
  );
}
export default SignUp;
