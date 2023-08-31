import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import carImage from "./img/car.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

import { Stack, Button } from "react-bootstrap";
import { ArrowRight, Envelope, HandThumbsUp, ChatLeftText, Share } from "react-bootstrap-icons";
import profileImg from "./img/profile.jpeg";

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

function Post(props) {
  return (
    <div className="post">
      <div className="postHead">
        <img src={props.profileImg} width={65} height={65} alt="" />
        <div>
          <h1> {props.name} </h1>
          <div className="date"> {props.date}</div>
        </div>
      </div>
      <br />

      <p> {props.text}</p>

      <img className="postImg" src={props.img} alt="" />

      <div className="postFooter">
        <div className="button">
          <HandThumbsUp />
          Like
        </div>
        <div className="button">
          <ChatLeftText /> Comment
        </div>
        <div className="button">
          <Share /> Share
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(
  <div>
    <Post
      profileImg={profileImg}
      name="Inzamam Malik"
      date="3-Jan-2013 4:30 pm"
      img="https://scontent.fkhi22-1.fna.fbcdn.net/v/t39.30808-6/353004991_634970768655599_1562410547950250051_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=iP5CdkXBKeQAX9MAERQ&_nc_ht=scontent.fkhi22-1.fna&oh=00_AfCABLXGN6tiaYzYUK_yrCcQnWdrn0KxbFjCjy0ZTlGWSw&oe=64EDD6B0"
      text="What’s going on here? Well, at first, it just renders “Hello “ because we’re not passing a name yet. But aside from that…
        When React renders a component, it passes the component’s props (short for “properties”) as the first argument, as an object. The props object is just a plain JS object, where the keys are prop names and the values are, well, the values of those props.
        You might then wonder, where do props come from? How do we pass them in? Good question."
    />
    <Post
      profileImg={profileImg}
      name="Abdul Wahid"
      date="20-Jan-2013 5:00 pm"
      img="https://i.brecorder.com/primary/2021/06/60d4868b13ca7.jpg"
      text="Quick warning though: this tutorial is compleeete. And by that I mean looong. I turned this into a full-fledged free 5-day course, and I made a nice-looking PDF you can read on your iPad or [whatever Android device is cool these days]. Drop your email in the box to get both. (it’s spread over 5 days, but you can jump ahead whenever you want)."
    />
    <Post
      profileImg={profileImg}
      name="Shakoor"
      date="20-Jan-2013 5:00 pm"
      img="https://i.brecorder.com/primary/2021/06/60d4868b13ca7.jpg"
      text="Quick warning though: this tutorial is compleeete. And by that I mean looong. I turned this into a full-fledged free 5-day course, and I made a nice-looking PDF you can read on your iPad or [whatever Android device is cool these days]. Drop your email in the box to get both. (it’s spread over 5 days, but you can jump ahead whenever you want)."
    />
  </div>,
  document.querySelector("#root")
);
