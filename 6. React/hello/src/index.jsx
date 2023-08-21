import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import carImage from "./img/car.jpg";

function Hi() {
  return (
    <div>
      Hello <strong>Malik</strong>
      <ul>
        <li>item 1</li>
        <li>item 1</li>
        <li>item 1</li>
        <li>item 5</li>
        <li>item 1</li>
      </ul>
      <div className="last">{5 + 10}</div>
      {60 * 4}
      <img width={200} src={carImage} alt="" />
    </div>
  );
}

ReactDOM.render(<Hi />, document.querySelector("#root"));
