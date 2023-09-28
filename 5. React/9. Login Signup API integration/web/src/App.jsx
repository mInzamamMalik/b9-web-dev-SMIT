import { useEffect, useState, useContext } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { Routes, Route, Link, Navigate } from "react-router-dom";

import Home from "./pages/home/home";
import About from "./pages/about/about";
import Chat from "./pages/chat/chat";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import splashScreen from "./assets/splash.gif";

import { GlobalContext } from "./context/context";

const baseUrl = "http://localhost:5001";

const App = () => {
  const { state, dispatch } = useContext(GlobalContext);

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
      await axios.post(`${baseUrl}/api/v1/logout`,{}, {
        withCredentials: true,
      });
      dispatch({
        type: "USER_LOGOUT"
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
          <nav>
            <ul>
              <li>
                <Link to={`/`}>Admin Home</Link>
              </li>
              <li>
                <Link to={`/chat`}>Admin Chat</Link>
              </li>
              <li>
                <Link to={`/about`}>Admin About</Link>
              </li>
              {state.user.email}
              <button onClick={logoutHandler}>Logout</button>
            </ul>
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
          <nav>
            <ul>
              <li>
                <Link to={`/`}>Home</Link>
              </li>
              <li>
                <Link to={`/chat`}>Chat</Link>
              </li>
              <li>
                <Link to={`/about`}>About</Link>
              </li>
              {state.user.email}
              <button onClick={logoutHandler}>Logout</button>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="chat" element={<Chat />} />

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
