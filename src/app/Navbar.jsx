"use client";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import cookieValue from "./get_accsses_token";

const NavbarMenu = () => {
  const [userData, setUserData] = useState("");

  const REACT_APP_API_URL = "https://scheduale-api.azurewebsites.net/";
  useEffect(() => {
    const getData = async (e) => {
      try {
        const response = await fetch(`${REACT_APP_API_URL}get-user`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            authorization: cookieValue,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error);
        }

        setUserData(result[0]);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const handdleLogout = async () => {
    try {
      const response = await fetch(`${REACT_APP_API_URL}logout`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: cookieValue,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }
      toast.success(result.message);
      document.cookie = `access_token=;`;
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.log(error);
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
      <Navbar fluid rounded className="flex mt-5">
        <div className="flex justify-around md:order-2 ml-5">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            }
          >
            {userData && (
              <Dropdown.Header>
                <span className="block text-sm">
                  {" "}
                  {userData.first_name + " " + userData.last_name}
                </span>
                <span className="block truncate text-sm font-medium">{userData.email}</span>
              </Dropdown.Header>
            )}
            <Dropdown.Divider />
            <Dropdown.Item onClick={handdleLogout}>Sign out</Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse className="mr-5">
          <Navbar.Link>
            <Link href="/dashboard"> Dashboard</Link>
          </Navbar.Link>

          <Navbar.Link>
            {" "}
            <Link href="/createposts"> Create New Post</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default NavbarMenu;
