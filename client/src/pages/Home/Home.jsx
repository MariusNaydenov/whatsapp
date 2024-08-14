import { Box } from "@mui/material";
import React, { useContext, useState } from "react";
import { MdOutlineStorage } from "react-icons/md";
import { BsChatText } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import { MdOutlineWifiTetheringErrorRounded } from "react-icons/md";
import { FaRegStar } from "react-icons/fa6";
import { FiArchive } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import Chat from "../../components/Chat/Chat";
import AppContext from "../../Context/AppContext";
import ChatOption from "../../components/ChatOption/ChatOption";
import RightSideTemplate from "../../components/RightSideTemplate/RightSideTemplate";

function Home() {
  const { selectedPerson, setSelectedPerson } = useContext(AppContext);
  const [selectedOption, setSelectedOption] = useState("chat");

  const handleOption = (option) => {
    if (option !== "chat") {
      setSelectedPerson(null);
    }
    setSelectedOption(option);
  };

  return (
    <Box
      style={{
        backgroundColor: " rgb(245 245 245)",
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="w-full py-2 px-3 flex flex-row items-center gap-2">
        <img src="/whatsapp-icon.svg" alt="icon" style={{ width: "25px" }} />
        <span className="text-xs">WhatsApp</span>
      </div>
      <div className="flex flex-row w-full h-full ">
        <div className="w-7-full flex-col flex justify-between py-2 px-2">
          <div className="flex flex-col py-3 gap-4  ">
            <div
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                borderRadius: "5px",
              }}
              className="py-2 px-2 hover:bg-neutral-200"
            >
              <MdOutlineStorage size={18} />
            </div>
            <div
              onClick={() => handleOption("chat")}
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                borderRadius: "5px",
                boxShadow:
                  selectedOption === "chat"
                    ? "inset 5px 0px 0px 0px #25D366"
                    : "",
              }}
              className="py-2 px-2 hover:bg-neutral-200"
            >
              <BsChatText size={18} />
            </div>
            <div
              onClick={() => handleOption("phone")}
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                borderRadius: "5px",
                boxShadow:
                  selectedOption === "phone"
                    ? "inset 5px 0px 0px 0px #25D366"
                    : "",
              }}
              className="py-2 px-2 hover:bg-neutral-200"
            >
              <FiPhone size={18} />
            </div>
            <div
              onClick={() => handleOption("status")}
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                borderRadius: "5px",
                boxShadow:
                  selectedOption === "status"
                    ? "inset 5px 0px 0px 0px #25D366"
                    : "",
              }}
              className="py-2 px-2 hover:bg-neutral-200"
            >
              <MdOutlineWifiTetheringErrorRounded size={18} />
            </div>
          </div>
          <div className="flex flex-col py-3 gap-4">
            <div
              onClick={() => handleOption("star")}
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                borderRadius: "5px",
                boxShadow:
                  selectedOption === "star"
                    ? "inset 5px 0px 0px 0px #25D366"
                    : "",
              }}
              className="py-2 px-2 hover:bg-neutral-200"
            >
              <FaRegStar size={18} />
            </div>
            <div
              onClick={() => handleOption("archive")}
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                borderRadius: "5px",
                boxShadow:
                  selectedOption === "archive"
                    ? "inset 5px 0px 0px 0px #25D366"
                    : "",
              }}
              className="py-2 px-2 hover:bg-neutral-200"
            >
              <FiArchive size={18} />
            </div>
            <hr style={{ width: "100%" }} />
            <div
              onClick={() => handleOption("settings")}
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                borderRadius: "5px",
                boxShadow:
                  selectedOption === "settings"
                    ? "inset 5px 0px 0px 0px #25D366"
                    : "",
              }}
              className="py-2 px-2 hover:bg-neutral-200"
            >
              <IoSettingsOutline size={18} />
            </div>
            <div
              onClick={() => handleOption("profile")}
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                borderRadius: "5px",
                boxShadow:
                  selectedOption === "profile"
                    ? "inset 5px 0px 0px 0px #25D366"
                    : "",
              }}
              className="py-2 px-2 hover:bg-neutral-200"
            >
              <CgProfile size={18} />
            </div>
          </div>
        </div>
        <div className="w-full h-full bg-white border-[1px] rounded-md flex flex-row">
          <div className="w-2/6 h-full border-r-[1px] flex flex-col py-4 px-4">
            {selectedOption === "chat" && <ChatOption />}
          </div>
          <div className="w-full h-full">
            {selectedOption === "chat" &&
              (selectedPerson ? (
                <Chat />
              ) : (
                <RightSideTemplate
                  showIcon={true}
                  title="WhatsApp for Windows"
                  subtitle="Send and receive messages without keeping your phone online."
                  subSubtitle="Use WhatsApp on up to 4 linked devices and 1 phone at the same time."
                />
              ))}
          </div>
        </div>
      </div>
    </Box>
  );
}

export default Home;
