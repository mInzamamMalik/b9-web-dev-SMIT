import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./login.css";


const baseUrl = 'http://localhost:5001'

const Login = () => {


  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const [alertMessage, setAlertMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const LoginSubmitHandler = async (e) => {
    e.preventDefault();


    try {
      const response = await axios.post(`${baseUrl}/api/v1/login`, {
        email: emailInputRef.current.value,
        password: passwordInputRef.current.value,
      },
      {
        withCredentials: true
      });

      console.log("resp: ", response?.data?.message);
      setAlertMessage(response?.data?.message);
    } catch (e) {
      console.log(e);
      setErrorMessage(e.response?.data?.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form id="loginForm" onSubmit={LoginSubmitHandler}>
        <label htmlFor="emailInput">Email:</label>
        <input ref={emailInputRef} type="email" autoComplete="email" name="emailInput" id="emailInput" required />

        <br />
        <label htmlFor="passwordInput">Password:</label>
        <input
          ref={passwordInputRef}
          type="password"
          autoComplete="current-password"
          name="passwordInput"
          id="passwordInput"
        />

        <br />

        <button type="submit">Login</button>

        <div className="alertMessage">{alertMessage}</div>
        <div className="errorMessage">{errorMessage}</div>
      </form>
    </div>
  );
};

export default Login;
