import img1 from "./../../assets/img1.jpg"
import img2 from "./../../assets/img2.jpeg"
import { useParams } from "react-router-dom"
import { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { baseUrl } from "../../core";
import { GlobalContext } from "../../context/context";
import io from 'socket.io-client';

import './chat.css'
const Chat = () => {
    let { state, dispatch } = useContext(GlobalContext);


    useEffect(() => {

        const socket = io(baseUrl);
        socket.on('connect', function () {
            console.log("connected")
        });
        socket.on('disconnect', function (message) {
            console.log("Socket disconnected from server: ", message);
        });

        socket.on(state?.user?._id, (e) => {
            console.log("a new message for you: ", e);
            setChat((prev) => {
                return [e, ...prev]
            });

        })

        return () => {
            socket.close();
        }
    }, [])



    // console.log("state: ", state);

    const params = useParams();
    const messageText = useRef("")
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState([]);
    const [toggleRefresh, setToggleRefresh] = useState(false);


    // console.log("params: ", params);

    const getChat = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${baseUrl}/api/v1/messages/${params.userId}`);
            // console.log(response.data);

            setIsLoading(false);
            setChat([...response.data]);
        } catch (error) {
            console.log(error.data);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getChat();

        return () => {

        };
    }, [toggleRefresh]);


    const sendMessageHandler = async (event) => {
        event.preventDefault();
        // console.log(messageText.current.value);

        try {
            setIsLoading(true);

            let formData = new FormData();

            formData.append("to_id", params.userId);
            formData.append("messageText", messageText.current.value);
            // formData.append("image", aaa.current.files[0]);

            const response = await axios.post(
                `${baseUrl}/api/v1/message`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })

            setIsLoading(false);
            setToggleRefresh(!toggleRefresh)
            // console.log(response.data);
            event.target.reset();
        } catch (error) {
            // handle error
            console.log(error?.data);
            setIsLoading(false);
        }


    }



    return (
        <div>
            <h1>Chat</h1>

            <div id="chatWindow">

                {chat.map((eachMessage, index) => (

                    <div key={index} className={`chatBaloon ${(eachMessage.from_id === state.user._id) ? "my" : "your"}`}>
                        {eachMessage.messageText}
                    </div>
                ))}

            </div>

            <form id="writeMessageForm" onSubmit={sendMessageHandler}>
                <input ref={messageText} name="message" placeholder="type your message" />
                <button>send</button>
            </form>

        </div>
    );
}
export default Chat;