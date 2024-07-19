"use client";
import { Link, useNavigate } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function SignUp() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handdleChange = (e) => {
    const { name, value } = e.target;
    setFormData((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}register`, {
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
      console.log(result);
      if (!response.ok) {
        throw new Error(result.error);
      }
      document.cookie = `access_token=${
        result.data.session.access_token
      }; expires=${expirationDate.toUTCString()}; path=/`;

      toast.success("Account Create Successfuly");
      navigate("/dashboard");
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
            <Label htmlFor="fname" value="Your email" />
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
            <Label htmlFor="lname" value="Your email" />
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
          // type="submit"
          onClick={submit}
          class="text-white text-center m-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-2xl mt-5  pl-5 pr-5   me-2 mb-2"
        >
          Submit
        </Button>

        <p>
          Already have an account{" "}
          <Link className="text-indigo-600" to="/login">
            Login{" "}
          </Link>
        </p>
      </form>
    </>
  );
}
export default SignUp;
