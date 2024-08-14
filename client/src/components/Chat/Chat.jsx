import React, { useContext } from "react";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { FiPhone } from "react-icons/fi";
import AppContext from "../../Context/AppContext";
import ChatMessages from "../ChatMessages/ChatMessages";

function Chat() {
  const { selectedPerson } = useContext(AppContext);
  const firstLetter = selectedPerson.username.slice(0, 1);
  const restLetters = selectedPerson.username.slice(1);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center w-full justify-between px-8 py-3 border-b-[1px]">
        <div className="flex items-center gap-2">
          {!selectedPerson.image ? (
            <img src="/profile.svg" width="40px" alt="" />
          ) : (
            <img src={selectedPerson["image"]} alt="" />
          )}
          <span className="font-bold text-sm">
            {firstLetter.toUpperCase() + restLetters}
          </span>
        </div>
        <div className="border-[1px] flex gap-3  items-center justify-center rounded">
          <div className="hover:bg-neutral-300 py-2 px-2">
            <AiOutlineVideoCamera size={24} />
          </div>

          <div className="hover:bg-neutral-300 py-2 px-2">
            <FiPhone size={24} />
          </div>
        </div>
      </div>
      <ChatMessages />
    </div>
  );
}

export default Chat;
