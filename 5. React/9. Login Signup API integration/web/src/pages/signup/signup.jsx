import { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import "./signup.css";

import { GlobalContext } from "./../../context/context";

import { baseUrl } from "../../core";

const Signup = () => {

  const {state, dispatch} = useContext(GlobalContext);

  const firstNameInputRef = useRef(null);
  const lastNameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const repeatPasswordInputRef = useRef(null);

  const [passwordErrorClass, setPasswordErrorClass] = useState("hidden");
  const [alertMessage, setAlertMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setAlertMessage("");
      setErrorMessage("");
    }, 5000);
  }, [alertMessage, errorMessage]);

  const SignupSubmitHandler = async (e) => {
    e.preventDefault();
    console.log("Signup submit handler");

    if (passwordInputRef.current.value !== repeatPasswordInputRef.current.value) {
      setPasswordErrorClass("");
      return;
    } else {
      setPasswordErrorClass("hidden");
    }

    try {
      const response = await axios.post(`${baseUrl}/api/v1/signup`, {
        firstName: firstNameInputRef.current.value,
        lastName: lastNameInputRef.current.value,
        email: emailInputRef.current.value,
        password: passwordInputRef.current.value,
      });

      console.log("resp: ", response.data.message);
      setAlertMessage(response.data.message);
    } catch (e) {
      console.log(e);
      setErrorMessage(e.response.data.message);
    }
  };

  return (
    <div>
      <h1> Signup Page </h1>
      <h2>{state.name}</h2>

      <form id="signup" onSubmit={SignupSubmitHandler}>
        <label htmlFor="firstNameInput">First Name:</label>
        <input
          ref={firstNameInputRef}
          type="text"
          autoComplete="given-name"
          name="firstNameInput"
          id="firstNameInput"
          required
        />

        <br />
        <label htmlFor="lastNameInput">Last Name:</label>
        <input
          ref={lastNameInputRef}
          type="text"
          autoComplete="family-name"
          name="lastNameInput"
          id="lastNameInput"
          required
        />

        <br />
        <label htmlFor="emailInput">Email:</label>
        <input ref={emailInputRef} type="email" autoComplete="email" name="emailInput" id="emailInput" required />

        <br />
        <label htmlFor="passwordInput">Password:</label>
        <input
          ref={passwordInputRef}
          type="password"
          autoComplete="new-password"
          name="passwordInput"
          id="passwordInput"
        />

        <br />
        <label htmlFor="repeatPasswordInput">Repeat Password:</label>
        <input
          ref={repeatPasswordInputRef}
          type="password"
          autoComplete="new-password"
          name="repeatPasswordInput"
          id="repeatPasswordInput"
        />
        <p className={`errorMessage ${passwordErrorClass}`} id="passwordError">
          Passwords do not match!
        </p>

        <br />

        <button type="submit">Sign Up</button>

        <div className="alertMessage">{alertMessage}</div>
        <div className="errorMessage">{errorMessage}</div>
      </form>
    </div>
  );
};

export default Signup;
