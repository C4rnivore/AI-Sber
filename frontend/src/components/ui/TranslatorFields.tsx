import React from "react";

export default function TranslatorFields() {
  return (
    <div className="w-full h-full flex justify-between items-start bg-[linear-gradient(45deg,#58CFDD30_0%,#90C7F230_50%,#84A9ED30_100%)] backdrop-blur-xl rounded-[2.222vw] border border-[#5ACFDD50] p-[1.111vw]">
      <textarea
        placeholder="Начните вводить текст..."
        className="w-[48%] h-[90%] bg-white rounded-[1.111vw] border resize-none focus:border-[#5ACFDD] border-[#96969650] p-[1.111vw]"
      ></textarea>
      <div className="w-px h-[90%]  bg-[#96969650]" />
      <div className="w-[48%] h-[90%] bg-white rounded-[1.111vw] border border-[#96969650] p-[1.111vw]" />
    </div>
  );
}
