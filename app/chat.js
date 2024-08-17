'use client';

import { useState, useEffect } from "react";
import { io } from "socket.io-client";

let RobotMessageInterval;
let RobotMessageIndex = 0;
const RobotMessages = [{
  author: "CPU 1",
  body: "Welcome to the React Chat app",
}, {
  author: "CPU 2",
  body: "How are you?",
}, {
  author: "CPU 1",
  body: "I could play this game for hours!"
}]

const SystemMessage = [];

// create a new socket instance with localhost URL
const socket = io('http://localhost:4000', { autoConnect: false });

export function Chat({ currentUser, onLogout }) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);

  const sendNextBotChat = () => {
    let message = RobotMessage[RobotMessageIndex++];

    // terminate chat bot
    if (!systemMessage) {
      endBotChats();
      return;
    }

    // send chat bot message
    socket.emit("chat", {
      author: systemMessage.author,
      body: systemMessage.body
    });
  }

  const startBotChats = () => {
    clearInterval(RobotMessageInterval)
    RobotMessageInterval = setInterval(sendNextBotChat, 3000)
  }

  const endBotChats = () => {
    clearInterval(RobotMessageInterval)
  }

  useEffect(() => {
    socket.connect(currentUser); // connect to socket

    socket.on("connect", () => { // fire when we have connection
      console.log("Socket connected");
      startBotChats()
    });

    socket.on("disconnect", () => { // fire when socked is disconnected
      console.log("Socket disconnected");
      endBotChats()
    });

    // listen chat event messages
    socket.on("chat", (newMessage) => {
      setMessages((previousMessages) => [...previousMessages, newMessage]);
    });

    // remove all event listeners
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("chat");
    };
  }, []);

  const handleSendMessage = (e) => {
    if (e.key !== "Enter" || inputValue.trim().length === 0) return;

    // send a message to the server
    socket.emit("chat", { author: currentUser, body: inputValue.trim() });
    setInputValue("");
  };

  const handleLogout = () => {
    socket.disconnect(); // disconnect when we do logout
    onLogout();
  };

  return (
    <div className="chat" style={{
      border: "1px solid var(--border-color-alt)",
      borderRadius: "var(--border-radius)"
    }}>
      <div className="chat-message-list" style={{
        backgroundColor: "var(--bg-alt)",
        paddingg: "12px"
      }}>
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`chat-message ${
              currentUser === message.author ? "outgoing" : ""
            }`}
            style={{marginBlock: "0.5rem"}}
          >
            <div className="chat-message-wrapper" style={{display: "flex"}}>
              { message.author && <span className="chat-message-author" style={{
                padding: "0.4rem 1rem 0 0",
                color: "#A93064"
              }}>{message.author}:</span>}
              <div className="chat-message-bubble" style={{
                backgroundColor: message.author && "rgb(63, 70, 89)",
                padding: "0.4rem",
                borderRadius: "6px",
                color: message.author && "rgb(218, 229, 253)"
              }}>
                <span className="chat-message-body"> {message.body}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-composer">
        <input
          className="chat-composer-input"
          placeholder="Type message here"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleSendMessage}
        />
      </div>
    </div>
  );
}
