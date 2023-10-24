import { useEffect, useState, useContext } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { Routes, Route, Link, Navigate } from "react-router-dom";

import Home from "./pages/home/home";
import ProfilePage from "./pages/profile/profile";
import About from "./pages/about/about";
import Chat from "./pages/chat/chat";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import splashScreen from "./assets/splash.gif";

import { GlobalContext } from "./context/context";
import { baseUrl } from "./core";

const App = () => {
  const { state, dispatch } = useContext(GlobalContext);

  useEffect(() => {
    axios.interceptors.request.use(
      function (config) {
        config.withCredentials = true;
        return config;
      },
      function (error) {
        // Do something with request error
        return Promise.reject(error);
      }
    );
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const resp = await axios.get(`${baseUrl}/api/v1/profile`, {
          withCredentials: true,
        });
        dispatch({
          type: "USER_LOGIN",
          payload: resp.data.data,
        });
      } catch (err) {
        console.log(err);
        dispatch({
          type: "USER_LOGOUT",
        });
      }
    };

    checkLoginStatus();
  }, []);

  const logoutHandler = async () => {
    try {
      await axios.post(
        `${baseUrl}/api/v1/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      dispatch({
        type: "USER_LOGOUT",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {/* admin routes */}
      {state.isLogin === true && state.role === "admin" ? (
        <>
          <nav className="navBar">
            <ul className="left">
              <li>
                <Link to={`/`}>Admin Home</Link>
              </li>
              <li>
                <Link to={`/chat`}>Admin Chat</Link>
              </li>
              <li>
                <Link to={`/about`}>Admin About</Link>
              </li>
            </ul>
            <div className="right">
              {state.user.email}
              <button onClick={logoutHandler}>Logout</button>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="chat" element={<Chat />} />

            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </Routes>
        </>
      ) : null}

      {/* user routes */}
      {state.isLogin === true && state.role === "user" ? (
        <>
          <nav className="navBar">
            <ul className="left">
              <li>
                <Link className="bg-indigo-500 rounded text-white py-1 px-6 mr-2" to={`/`}>Home</Link>
              </li>
              <li>
                <Link className="bg-indigo-500 rounded text-white py-1 px-6 m-2" to={`/profile/${state.user._id}`}>Profile</Link>
              </li>
              <li>
                <Link className="bg-indigo-500 rounded text-white py-1 px-6 m-2" to={`/chat`}>Chat</Link>
              </li>
              <li>
                <Link className="bg-indigo-500 rounded text-white py-1 px-6 m-2" to={`/about`}>About</Link>
              </li>
            </ul>
            <div className="right">
              {state.user.email}
              <button
                type="button"
                className="text-indigo-500 rounded bg-transparent py-1 px-6 m-2 border border-indigo-500"
                onClick={logoutHandler}
              >
                Logout
              </button>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="chat" element={<Chat />} />
            <Route path="profile/:userId" element={<ProfilePage />} />

            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </Routes>
        </>
      ) : null}

      {/* unAuth routes */}
      {state.isLogin === false ? (
        <>
          <nav>
            <ul>
              <li>
                <Link to={`/login`}>Login</Link>
              </li>
              <li>
                <Link to={`/signup`}>Signup</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="profile/:userId" element={<ProfilePage />} />

            <Route path="*" element={<Navigate to="/login" replace={true} />} />
          </Routes>
        </>
      ) : null}

      {/* splash screen */}
      {state.isLogin === null ? (
        <div>
          <img
            src={splashScreen}
            className="splashScreen"
            width="100%"
            height="100%"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              margin: "auto",
              zIndex: -1,
            }}
            alt="splash screen"
          />
        </div>
      ) : null}
    </div>
  );
};

export default App;
