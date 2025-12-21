import ChatIcon from "@/icons/ChatIcon";
import DictionaryIcon from "@/icons/DictionaryIcon";
import React from "react";
import { motion, AnimatePresence } from "motion/react";

export default function UsageExamples({
  wordUsages,
  sentencesUsages,
}: {
  wordUsages: string[];
  sentencesUsages: { original: string; translation: string }[];
}) {
  return (
    <AnimatePresence mode="wait">
      {(wordUsages.length > 0 || sentencesUsages.length > 0) && (
        <motion.div
          key="usage-examples"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
          className="lg:px-[10.417vw] px-[13vw] lg:pt-[1.146vw] pt-[9.25vw] pb-[4.219vw] mt-[1.927vw] bg-[#D9E4D9]"
        >
          <div className="flex max-lg:flex-col justify-between items-start bg-white lg:rounded-[0.625vw] rounded-[2vw] lg:p-[1.042vw] p-[4vw]">
            <div className="w-full lg:text-[1.667vw] text-[4vw] text-[#2C734E] lg:mb-[0.972vw] mb-[5vw] font-semibold">
              <h2 className="lg:pb-[0.625vw] pb-[3vw]">
                Примеры использования
              </h2>
              <ul className="flex flex-col lg:gap-[1.667vw] gap-[3vw]">
                {sentencesUsages.slice(0, 5).map((usage, index) => (
                  <li key={index}>
                    <div className="text-black font-normal flex lg:gap-[0.833vw] gap-[3vw]">
                      <div className="lg:size-[1.875vw] size-[5vw] max-lg:mt-[1vw]">
                        <ChatIcon />
                      </div>
                      <div className="lg:text-[0.833vw] text-[4vw] flex flex-col max-w-[80%]">
                        <p>{usage.original}</p>
                        <p className="text-[#868686]">{usage.translation}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full lg:text-[1.667vw] text-[4vw] text-[#2C734E] mb-[0.972vw] font-semibold">
              <h2 className="lg:pb-[0.625vw] pb-[3vw]">Словарь</h2>
              <ul className="flex flex-col lg:gap-[1.667vw] gap-[3vw]">
                {wordUsages.slice(0, 5).map((word, index) => (
                  <li key={index}>
                    <div className="text-black font-normal flex items-center lg:gap-[0.833vw] gap-[3vw]">
                      <div className="lg:size-[1.875vw] size-[5vw] max-lg:mt-[1vw]">
                        <DictionaryIcon />
                      </div>
                      <div className="lg:text-[0.833vw] text-[4vw] flex flex-col max-w-[80%]">
                        <p>{word}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
