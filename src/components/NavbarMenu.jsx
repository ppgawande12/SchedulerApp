import { Avatar, Dropdown, Navbar } from "flowbite-react";
import cookieValue from "./get_access_token";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

const NavbarMenu = () => {
  const [userData, setUserData] = useState("");

  const REACT_APP_API_URL = "https://schedule-rapp.onrender.com/";
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
                  {userData[0].first_name + " " + userData[0].last_name}
                </span>
                <span className="block truncate text-sm font-medium">{userData[0].email}</span>
              </Dropdown.Header>
            )}
            <Dropdown.Divider />
            <Dropdown.Item onClick={handdleLogout}>Sign out</Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse className="mr-5">
          <Navbar.Link>
            <a href="/dashboard"> Dashboard</a>
          </Navbar.Link>

          <Navbar.Link>
            {" "}
            <a href="/createpost"> Create New Post</a>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default NavbarMenu;
