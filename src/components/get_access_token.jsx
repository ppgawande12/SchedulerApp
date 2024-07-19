const cookieName = "access_token";
const cookies = document.cookie.split(";");

let cookieValue = null;
cookies.forEach((cookie) => {
  const [name, value] = cookie.split("=").map((c) => c.trim());
  if (name === cookieName) {
    cookieValue = decodeURIComponent(value);
  }
});

export default cookieValue;
