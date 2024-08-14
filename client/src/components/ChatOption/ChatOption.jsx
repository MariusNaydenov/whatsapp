import React, { useContext, useEffect, useState } from "react";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { MdOutlineSubject } from "react-icons/md";
import AppContext from "../../Context/AppContext";
import io from "socket.io-client";



function ChatOption() {
  const {
    selectedPerson,
    setSelectedPerson,
    user,
    setChat,
    chat,
    peopleChattedWith,
    setPeopleChattedWith,
  } = useContext(AppContext);
  const [newChat, setNewChat] = useState(false);
  const [users, setUsers] = useState([]);
  const [cache, setCache] = useState({});
  const API = import.meta.env.VITE_URL_API;
  const socket = io(`${API}`);

    useEffect(() => {
      socket.on("message", (msg) => {
        setChat([...msg]);
      });

    }, []);

  const getChatWithSelectedPerson = async (userId, selectedPersonId) => {
    try {
      const response = await fetch(
        `${API}/chats/${userId}/${selectedPersonId}`
      );
      const chat = await response.json();
      return chat;
    } catch (err) {
      console.log(err);
    }
  };

  const selectPerson = async (selectedPersonId) => {
    if (cache[selectedPersonId]) {
      const chat = await getChatWithSelectedPerson(user._id, selectedPersonId);
      setChat(chat[0].messages);
      return setSelectedPerson(cache[selectedPersonId]);
    }
    try {
      const response = await fetch(`${API}/users/${selectedPersonId}`);
      const user = await response.json();
      setCache((prev) => ({ ...prev, [selectedPersonId]: user }));
      setSelectedPerson(user);
      const chat = await getChatWithSelectedPerson(user._id, selectedPersonId);
      setChat(chat[0].messages);
    } catch (err) {
      console.log(err);
    }
  };

  const getChats = async () => {
    try {
      const response = await fetch(`${API}/chats/get-chats/${user._id}`);
      const data = await response.json();
      user.people = data;
      data.sort(
        (a, b) =>
          new Date(b.messages[b.messages.length - 1].createdAt) -
          new Date(a.messages[a.messages.length - 1].createdAt)
      );

      setPeopleChattedWith(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getChats();
  }, [user, chat]);

  const getUsers = async () => {
    try {
      const response = await fetch(`${API}/users/all-users`);
      if (response.ok) {
        const users = await response.json();
        return users;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleNewChatModal = async () => {
    setNewChat(!newChat);
    const allUsers = await getUsers();
    setUsers(allUsers.sort((a, b) => a.username.localeCompare(b.username)));
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <span className="font-bold text-xl">Chats</span>
        <div className="flex flex-row gap-2">
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              borderRadius: "5px",
            }}
            className={`${
              newChat ? "bg-neutral-200" : ""
            } py-2 px-2 hover:bg-neutral-200 relative`}
            onClick={handleNewChatModal}
          >
            <HiOutlinePencilSquare size={20} />
            {newChat && (
              <div className="absolute rounded border-[1px] w-80 h-96 bg-zinc-100 top-10 left-0 shadow-lg  flex flex-col">
                <span className="font-bold text-lg py-3 px-4">New Chat</span>
                <span className="text-slate-400 mt-2 mb-3 text-sm px-4">
                  All contacts
                </span>
                <div className="flex flex-col h-auto gap-4 w-full px-1 mb-3 overflow-y-auto">
                  {users.map((person) => {
                    const firstLetter = person.username.slice(0, 1);
                    const restLetters = person.username.slice(1);
                    if (person.username !== user.username) {
                      return (
                        <div
                          key={person._id}
                          className="flex flex-row w-full gap-4 items-center hover:bg-neutral-300 py-2 px-2 rounded hover: cursor-pointer"
                          onClick={() => selectPerson(person._id)}
                        >
                          {!person["image"] ? (
                            <img src="/profile.svg" width="40px" alt="" />
                          ) : (
                            <img src={person.image} alt="" />
                          )}
                          <div className="flex flex-col w-full ">
                            <span className="font-bold text-base">
                              {firstLetter.toUpperCase() + restLetters}
                            </span>
                            <span className="w-full text-ellipsis overflow-hidden whitespace-nowrap text-sm text-neutral-600">
                              Hey there! I am using WhatsApp.
                            </span>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            )}
          </div>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              borderRadius: "5px",
            }}
            className="py-2 px-2 hover:bg-neutral-200"
          >
            <MdOutlineSubject size={20} />
          </div>
        </div>
      </div>
      <input
        type="text"
        className="w-full border-[1px] mt-5 rounded pl-3 text-sm py-1 outline-0"
        placeholder="Search or start a new chat"
      />
      <div
        className="flex flex-col grow overflow-y-auto "
        style={{ maxHeight: "565px" }}
      >
        {peopleChattedWith.map((person) => {
          const personId = person.members
            .filter((id) => id !== user._id)
            .toString();
          const lastMsg = person.messages[person.messages.length - 1].content;
          const timestamp =
            person.messages[person.messages.length - 1].createdAt;
          const lastMessage =
            lastMsg.length > 15 ? lastMsg.slice(0, 28) + "..." : lastMsg;
          const date = new Date(timestamp);
          const day = date.getDay();
          const month = date.getMonth();
          const year = date.getFullYear();

          if (user.username === person.participantOne.username) {
            return (
              <div
                onClick={() => selectPerson(personId)}
                className={`flex flex-row mt-5 gap-3 cursor-pointer hover:bg-neutral-100 py-2 rounded px-2
                  ${
                    selectedPerson
                      ? selectedPerson.username ===
                        person.participantTwo.username
                        ? "bg-neutral-300"
                        : ""
                      : ""
                  }
                  `}
                key={person.participantTwo._id}
              >
                {!person.image ? (
                  <img src="/profile.svg" width="35px" alt="" />
                ) : (
                  <img src={person.image} />
                )}
                <div className="flex flex-col flex-grow">
                  <span className="text-sm font-bold">
                    {person.participantTwo.username}
                  </span>
                  <span className="text-sm text-slate-600"> {lastMessage}</span>
                </div>
                <div className="flex justify-end items-center mb-4">
                  <span className="text-xs text-slate-600 ">
                    {day}/{month}/{year}
                  </span>
                </div>
              </div>
            );
          } else {
            return (
              <div
                onClick={() => selectPerson(personId)}
                className="flex flex-row mt-5 gap-3 cursor-pointer hover:bg-neutral-100 py-2 rounded px-2"
                key={person.participantOne._id}
              >
                {!person.image ? (
                  <img src="/profile.svg" width="35px" alt="" />
                ) : (
                  <img src={person.image} />
                )}
                <div className="flex flex-col flex-grow">
                  <span className="text-sm font-bold">
                    {person.participantOne.username}
                  </span>
                  <span className="text-sm text-slate-600"> {lastMessage}</span>
                </div>
                <div className="flex justify-end items-center mb-4">
                  <span className="text-xs text-slate-600 ">
                    {day}/{month}/{year}
                  </span>
                </div>
              </div>
            );
          }
        })}
      </div>
    </>
  );
}

export default ChatOption;
