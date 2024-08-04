import React, { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../../Context/AppContext";
import { LuSendHorizonal } from "react-icons/lu";
import { GrEmoji } from "react-icons/gr";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function ChatMessages() {
  const {
    message,
    setMessage,
    user,
    selectedPerson,
    chat,
    setUser,
    setChat,
    setPeopleChattedWith,
    peopleChattedWith,
  } = useContext(AppContext);
  const messageRef = useRef(null);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState(null);
  useEffect(() => {
    socket.on("message", (msg) => {
      setChat([...msg]);
    });
  }, []);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "instant" });
  }, [chat]);

  const getChats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/get-chats/${user.userId}`
      );
      const data = await response.json();
      user.people = data;

      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessageThroughInput = async (
    event,
    userId,
    receiverID,
    content
  ) => {
    const firstId = userId;
    const secondId = receiverID;

    if (!content) {
      return;
    }

    if (event.key === "Enter") {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/create-chat`,
          {
            method: "POSt",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstId, secondId, content }),
          }
        );

        const data = await response.json();
        const ifChatExist = user.people.some((item) => item._id === data._id);

        // const getAllChats = await getChats();

        const obj = { receiver: receiverID, name: "test" };

        socket.emit("message", data.messages);
        socket.emit("someData", obj);

        setChat([...data.messages]);

        if (!ifChatExist) {
          const addNewChat = [...user.people, data];
          setUser({ ...user, people: addNewChat });
        }

        if (response.ok) {
          setMessage("");
        } else {
          console.log("something went wrong");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const sendMessage = async (userId, receiverID, content) => {
    const firstId = userId;
    const secondId = receiverID;

    if (!content) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/create-chat`,
        {
          method: "POSt",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstId, secondId, content }),
        }
      );

      const data = await response.json();
      const ifChatExist = user.people.some((item) => item._id === data._id);

      // const getAllChats = await getChats();

      const obj = { receiver: receiverID, name: "test" };

      socket.emit("message", data.messages);
      socket.emit("someData", obj);

      setChat([...data.messages]);

      if (!ifChatExist) {
        const addNewChat = [...user.people, data];
        setUser({ ...user, people: addNewChat });
      }

      if (response.ok) {
        setMessage("");
      } else {
        console.log("something went wrong");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div
        className="flex gap-1 flex-1 w-full flex-col px-12 py-5 overflow-y-auto "
        style={{
          backgroundImage: "url('/w-bg-2.jpg')",
          backgroundPosition: "center",
          objectFit: "fill",
          maxHeight: "572px",
        }}
      >
        {chat.map((chatObj, idx) => {
          const sender = chatObj.sender.username;
          const timestamp = chatObj.createdAt;
          const date = new Date(timestamp);
          const hour = date.getHours();
          const minutes = date.getMinutes();
          const isLastMessage = idx === chat.length - 1;

          if (sender === user.username) {
            return (
              <div
                ref={isLastMessage ? messageRef : null}
                key={chatObj._id}
                className="flex justify-end w-full"
              >
                <div
                  style={{ backgroundColor: "#90EE90" }}
                  className="flex flex-row gap-4 py-1 px-2 border-[1px] rounded items-center justify-center"
                >
                  <span
                    className="text-sm py-1"
                    style={{
                      maxWidth: "425px",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {chatObj.content}
                  </span>
                  <div className="text-xs flex mt-7 ml-1 text-zinc-500">
                    <span>{hour}</span>:
                    <span>{minutes < 10 ? "0" + minutes : minutes}</span>
                    <span className="ml-1">
                      {hour >= 13 && hour <= 23 ? "PM" : "AM"}
                    </span>
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div key={chatObj._id} className="flex justify-start w-full">
                <div
                  // key={chatObj._id}
                  className="flex w-auto h-auto flex-row bg-white gap-4 py-1 px-2 border-[1px] rounded items-center justify-center"
                >
                  <span
                    className="text-sm py-1"
                    style={{
                      maxWidth: "425px",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {chatObj.content}
                  </span>

                  <div className="text-xs flex mt-7 ml-1 text-zinc-500">
                    <span>{hour}</span>:<span>{minutes}</span>
                    <span className="ml-1">
                      {hour >= 13 && hour <= 23 ? "PM" : "AM"}
                    </span>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>

      <div className="border-t-[1px] flex w-full items-center h-12 py-1 px-2 gap-8">
        <div
          onClick={() => setPickerVisible(!isPickerVisible)}
          className="flex items-center px-2 hover:bg-neutral-100 h-full rounded relative"
        >
          <GrEmoji size={19} />
          <div
            className={`${
              isPickerVisible ? "block" : "hidden"
            } absolute bottom-full mb-2`}
          >
            <Picker
              data={data}
              previewPosition="none"
              onEmojiSelect={(e) => {
                setCurrentEmoji(e.native);
                setMessage((prev) => prev + currentEmoji);
                setPickerVisible(!isPickerVisible);
              }}
            />
          </div>
        </div>

        <div className="flex flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex w-full outline-0 overflow-y-auto text-sm"
            onKeyDown={(e) =>
              sendMessageThroughInput(
                e,
                user.userId,
                selectedPerson._id,
                message
              )
            }
          />
        </div>
        <div
          onClick={() => sendMessage(user.userId, selectedPerson._id, message)}
          className="flex items-center px-2 hover:bg-neutral-100 h-full rounded"
        >
          <LuSendHorizonal size={19} />
        </div>
      </div>
    </>
  );
}

export default ChatMessages;
