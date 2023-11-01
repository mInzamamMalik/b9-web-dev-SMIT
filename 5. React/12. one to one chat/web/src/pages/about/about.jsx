import "./about.css";
import { GlobalContext } from "../../context/context";
import { useState, useRef, useEffect, useContext } from "react";

const About = () => {
  let { state, dispatch } = useContext(GlobalContext);

  return (
    <div>
      <h1>About</h1>

      <div>{JSON.stringify(state)}</div>
    </div>
  );
};

export default About;
