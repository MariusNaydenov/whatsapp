import React, { useContext, useState } from "react";
import AppContext from "../../Context/AppContext";
import { LuSendHorizonal } from "react-icons/lu";
import { GrEmoji } from "react-icons/gr";

function ChatMessages() {
  const { message, setMessage, user, selectedPerson, chat, setUser } =
    useContext(AppContext);

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
        className="flex gap-1 flex-1 w-full flex-col h-full px-12 py-5"
        style={{
          backgroundImage: "url('/w-bg-2.jpg')",
          backgroundPosition: "center",
          objectFit: "fill",
        }}
      >
        {chat.map((chatObj) => {
          const sender = chatObj.sender.username;
          const timestamp = chatObj.createdAt;
          const date = new Date(timestamp);
          const hour = date.getHours();
          const minutes = date.getMinutes();
          if (sender === user.username) {
            return (
              <div key={chatObj._id} className="flex justify-end w-full">
                <div
                  style={{ backgroundColor: "#90EE90" }}
                  className="flex flex-row gap-4 py-1 px-2 border-[1px] rounded items-center justify-center"
                >
                  {/* {chatObj.content} */}
                  <span className="text-sm flex justify-start w-full">
                    {chatObj.content}
                  </span>
                  <div className="text-xs flex mt-4 text-zinc-500">
                    <span>{hour}</span>:<span>{minutes}</span>
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
                  key={chatObj._id}
                  className="flex flex-row bg-white gap-4 py-1 px-2 border-[1px] rounded items-center justify-center"
                >
                  <span className="text-sm flex justify-start w-full">
                    {chatObj.content}
                  </span>
                  <div className="text-xs flex mt-4 text-zinc-500">
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
        <div className="flex items-center px-2 hover:bg-neutral-100 h-full rounded">
          <GrEmoji size={19} />
        </div>
        <div className="flex flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex w-full outline-0 overflow-y-auto text-sm"
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
