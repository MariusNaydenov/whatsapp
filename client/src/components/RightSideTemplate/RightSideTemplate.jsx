import React from "react";
import { CiLock } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa";

function RightSideTemplate({ showIcon, title, subtitle, subSubtitle }) {
  return (
    <div className="w-full h-full flex flex-col justify-between py-10 items-center">
      <div></div>
      <div className="flex flex-col justify-center items-center ">
        {showIcon && <FaWhatsapp color="rgb(161 161 170)" size={70} />}
        <span className="font-bold text-lg mb-3 mt-5">{title}</span>
        <span className="text-sm text-zinc-400">{subtitle}</span>
        <span className="text-sm text-zinc-400">{subSubtitle}</span>
      </div>
      <span className="text-sm text-zinc-400 flex items-center gap-2">
        {" "}
        <CiLock size={15} />
        End-to-end encrypted
      </span>
    </div>
  );
}

export default RightSideTemplate;
