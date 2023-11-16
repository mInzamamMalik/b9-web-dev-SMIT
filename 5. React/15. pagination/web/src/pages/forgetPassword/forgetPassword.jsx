import { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


import { GlobalContext } from "../../context/context";

import { baseUrl } from "../../core";

const Login = () => {
  const navigate = useNavigate();

  let { state, dispatch } = useContext(GlobalContext);

  const emailInputRef = useRef(null);

  const [alertMessage, setAlertMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setAlertMessage("");
      setErrorMessage("");
    }, 5000);
  }, [alertMessage, errorMessage]);

  const ForgetPasswordSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/forget-password`,
        {
          email: emailInputRef.current.value,
        }
      );

      console.log("resp: ", response?.data?.message);
      setAlertMessage(response?.data?.message);
      navigate(`/forget-password-complete`, { state: { email: emailInputRef.current.value } });


    } catch (e) {
      console.log(e);
      setErrorMessage(e.response?.data?.message);
    }
  };

  return (
    <div>
      <h1>Forget Password</h1>

      <form id="loginForm" onSubmit={ForgetPasswordSubmitHandler}>
        <label htmlFor="emailInput">Email:</label>
        <input ref={emailInputRef} type="email" autoComplete="email" name="emailInput" id="emailInput" required />

        <button type="submit">Next</button>

        <div className="alertMessage">{alertMessage}</div>
      </form>
    </div>
  );
};

export default Login;
