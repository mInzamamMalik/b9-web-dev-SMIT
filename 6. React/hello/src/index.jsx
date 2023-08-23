import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import carImage from "./img/car.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

import { Stack, Button } from "react-bootstrap";
import { ArrowRight, Envelope } from "react-bootstrap-icons";

function Hi() {
  return (
    <div>
      <Stack direction="vertical" gap={2}>
        <Button as="a" variant="primary">
          <ArrowRight />
          Button as link
        </Button>
        <Button as="a" variant="success">
          <Envelope /> Button as link
        </Button>
      </Stack>

      <Stack direction="vertical" gap={2}>
        <Button>Click me</Button>
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
      </Stack>
    </div>
  );
}

ReactDOM.render(<Hi />, document.querySelector("#root"));
