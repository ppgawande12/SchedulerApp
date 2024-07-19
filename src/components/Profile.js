import { Button, Card } from "flowbite-react";
import logo from "./profilelogo.png";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import cookieValue from "./get_access_token";
import NavbarMenu from "./NavbarMenu";

const Profile = () => {
  const [userData, setUserData] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const getData = async (e) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}get-user`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            authorization: cookieValue,
          },
        });
        // console.log(response);
        const result = await response.json();
        // console.log(result);
        setUserData(result);
        if (!response.ok) {
          throw new Error(result.error);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const handdleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}logout`, {
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
        navigate("/login");
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
      <NavbarMenu />
      <div className=" flex justify-center mt-10 w-auto">
        {userData && (
          <Card className="max-w-sm">
            <div className="flex flex-col items-center pb-10">
              <img
                alt="Bonnie image"
                height="96"
                src={logo}
                width="96"
                className="mb-3 rounded-full shadow-lg"
              />
              <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                {userData[0].first_name + " " + userData[0].last_name}
              </h5>
              <span className="text-sm text-gray-500 dark:text-gray-400">{userData[0].email}</span>
            </div>
            <Button onClick={handdleLogout}>logout</Button>
          </Card>
        )}
      </div>
    </>
  );
};

export default Profile;
