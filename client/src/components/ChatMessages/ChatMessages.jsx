import React, { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../../Context/AppContext";
import { LuSendHorizonal } from "react-icons/lu";
import { GrEmoji } from "react-icons/gr";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import io from "socket.io-client";

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

  const API = import.meta.env.VITE_URL_API;
  const socket = io(`${API}`);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "instant" });
  }, [chat]);

  const sendMessage = async (userId, receiverId, message, e, element) => {
    if (!message) {
      return;
    }

    if (element === "button") {
      try {
        const response = await fetch(`${API}/chats/create-chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, receiverId, message }),
        });
        //returns the chat object
        const data = await response.json();

        //check if chat exist if not put it in user.people
        const ifChatExist = user.people.some((item) => item._id === data._id);

        socket.emit("message", data.messages);

        setChat([...data.messages]);

        if (!ifChatExist) {
          const addNewChat = [...user.people, data];
          setUser({ ...user, people: addNewChat });
        }

        if (response.ok) {
          setMessage("");
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      if (e.key === "Enter") {
        try {
          const response = await fetch(`${API}/chats/create-chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, receiverId, message }),
          });
          const data = await response.json();

          //check if chat exist if not put it in user.people
          const ifChatExist = user.people.some((item) => item._id === data._id);

          setChat([...data.messages]);

          if (!ifChatExist) {
            const addNewChat = [...user.people, data];
            setUser({ ...user, people: addNewChat });
          }

          if (response.ok) {
            setMessage("");
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  useEffect(() => {
    socket.on("message", (msg) => {
      setChat([...msg]);
    });
  }, [chat]);

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
          const sender = chatObj.sender;
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
              sendMessage(user._id, selectedPerson._id, message, e, "input")
            }
          />
        </div>
        <div
          // onClick={() => sendMessage(user.userId, selectedPerson._id, message)}
          onClick={(e) =>
            sendMessage(user._id, selectedPerson._id, message, e, "button")
          }
          className="flex items-center px-2 hover:bg-neutral-100 h-full rounded"
        >
          <LuSendHorizonal size={19} />
        </div>
      </div>
    </>
  );
}

export default ChatMessages;
