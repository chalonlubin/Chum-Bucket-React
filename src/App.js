import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer, toast } from "react-toastify";
import { BrowserRouter, UNSAFE_RouteContext } from "react-router-dom";
import FrienderApi from "./Helpers/api";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";


import NavBar from "./Routes/NavBar";
import RoutesList from "./Routes/RoutesList";
import Loading from "./Common/Loading";
import TOAST_DEFAULTS from "./Helpers/toastSettings";
import userContext from "./User/userContext";

const LOCAL_STORAGE_TOKEN_KEY = "token";

/**
 *
 * @returns
 */

function App() {
  const [currUser, setCurrUser] = useState(null);
  const [currToken, setCurrToken] = useState(
    localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)
  );
  const [isLoading, setIsLoading] = useState(true);

  async function handleLogin(data) {
    const token = await FrienderApi.loginUser(data);
    handleToken(token);
    setCurrToken(token);
    toast("🚀 Login Successful!", TOAST_DEFAULTS);
  }

  async function handleRegister(data) {
    console.log("register", data)
    const token = await FrienderApi.registerUser(data);
    handleToken(token);
    setCurrToken(token);
    toast("✅ Sign-up Successful!", TOAST_DEFAULTS);
  }

  function handleLogout() {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    setCurrToken(null);
    setCurrUser(null);
    toast("👋 Logout Successful!", TOAST_DEFAULTS);
  }

  async function handleUpdate(data) {
    const newUserInfo = await FrienderApi.updateUser(currUser.username, data);
    setCurrUser((prevInfo) => ({ ...prevInfo, ...newUserInfo }));
    toast("👍 Update Successful!", TOAST_DEFAULTS);
  }

  function handleToken(token) {
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    setIsLoading(true);
  }

  //TODO: figure out when to get matches and get rest of users
  useEffect(
    function handleUser() {
      async function getUser() {
        FrienderApi.token = currToken;
        const { username } = jwt_decode(currToken);
        const user = await FrienderApi.getUser(username);
        setCurrUser(user);
        setIsLoading(false);
      }
      if (currToken !== null) {
        getUser();
      } else {
        setIsLoading(false);
      }
    },
    [currToken]
  );

  if (isLoading) return <Loading />;

  return (
    <div className="App">
      <div className="Friender">
        <userContext.Provider value={{ currUser }}>
          <BrowserRouter>
            <ToastContainer />
            <NavBar handleLogout={handleLogout} />
            <RoutesList
              handleLogin={handleLogin}
              handleRegister={handleRegister}
              handleUpdate={handleUpdate}
            />
          </BrowserRouter>
        </userContext.Provider>
      </div>
    </div>
  );
}

export default App;
