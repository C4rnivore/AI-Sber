import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import ChatIcon from "@/icons/ChatIcon";
import DictionaryIcon from "@/icons/DictionaryIcon";

const MAX_ITEMS = 3;

type SentenceUsage = { original: string; translated: string };

interface WordUsagesPanelProps {
  word: string;
  wordUsages: string[];
  sentencesUsages: SentenceUsage[];
}

function highlightWord(text: string, word: string) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === word.toLowerCase() ? (
      <strong key={i}>{part}</strong>
    ) : (
      part
    ),
  );
}

export default function WordUsagesPanel({
  word,
  wordUsages,
  sentencesUsages,
}: WordUsagesPanelProps) {
  const trimmed = word.trim();
  const showPanel = wordUsages.length > 0 || sentencesUsages.length > 0;
  const hadDataOnMount = useRef(showPanel);

  return (
    <AnimatePresence>
      {showPanel && (
        <motion.div
          initial={
            hadDataOnMount.current ? false : { opacity: 0, y: -10 }
          }
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="lg:mt-[1.111vw] mt-[3vw] lg:rounded-[1.667vw] rounded-[5vw] bg-[linear-gradient(45deg,#58CFDD20_0%,#90C7F220_50%,#84A9ED20_100%)] lg:p-[1.111vw] p-[3vw]"
        >
          <div className="bg-white border border-[#96969650] lg:rounded-[1.528vw] rounded-[4.5vw] lg:p-[1.667vw] p-[4vw]">
            <div className="flex lg:flex-row flex-col lg:gap-[2.222vw] gap-[5vw]">
              {sentencesUsages.length > 0 && (
                <div className="flex-1">
                  <h3 className="lg:text-[1.111vw] text-[3.5vw] font-semibold lg:mb-[1.111vw] mb-[3vw]">
                    Примеры использования
                  </h3>
                  <div className="lg:space-y-[1.111vw] space-y-[3vw]">
                    {sentencesUsages.slice(0, MAX_ITEMS).map((sentence, i) => (
                      <div key={i} className="flex items-start lg:gap-[0.694vw] gap-[2vw]">
                        <ChatIcon className="lg:size-[1.389vw] size-[4.5vw] text-[#555] shrink-0 lg:mt-[0.139vw] mt-[0.5vw]" />
                        <div>
                          <p className="lg:text-[0.972vw] text-[3.2vw] leading-snug">
                            {highlightWord(sentence.original, trimmed)}
                          </p>
                          <p className="lg:text-[0.833vw] text-[2.8vw] text-[#96969650] leading-snug">
                            {sentence.translated}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {wordUsages.length > 0 && (
                <div className="flex-1">
                  <h3 className="lg:text-[1.111vw] text-[3.5vw] font-semibold lg:mb-[1.111vw] mb-[3vw]">
                    Словарь
                  </h3>
                  <div className="lg:space-y-[0.833vw] space-y-[2.5vw]">
                    {wordUsages.slice(0, MAX_ITEMS).map((w, i) => (
                      <div key={i} className="flex items-center lg:gap-[0.694vw] gap-[2vw]">
                        <DictionaryIcon className="lg:size-[1.389vw] size-[4.5vw] text-[#555] shrink-0" />
                        <span className="lg:text-[0.972vw] text-[3.2vw]">{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
