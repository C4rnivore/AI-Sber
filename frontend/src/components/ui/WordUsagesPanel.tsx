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
          className="mt-[1.111vw] rounded-[1.667vw] bg-[linear-gradient(45deg,#58CFDD20_0%,#90C7F220_50%,#84A9ED20_100%)] p-[1.111vw]"
        >
          <div className="bg-white border border-[#96969650] rounded-[1.528vw] p-[1.667vw]">
            <div className="flex gap-[2.222vw]">
              {sentencesUsages.length > 0 && (
                <div className="flex-1">
                  <h3 className="text-[1.111vw] font-semibold mb-[1.111vw]">
                    Примеры использования
                  </h3>
                  <div className="space-y-[1.111vw]">
                    {sentencesUsages.slice(0, MAX_ITEMS).map((sentence, i) => (
                      <div key={i} className="flex items-start gap-[0.694vw]">
                        <ChatIcon className="size-[1.389vw] text-[#555] shrink-0 mt-[0.139vw]" />
                        <div>
                          <p className="text-[0.972vw] leading-snug">
                            {highlightWord(sentence.original, trimmed)}
                          </p>
                          <p className="text-[0.833vw] text-[#96969650] leading-snug">
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
                  <h3 className="text-[1.111vw] font-semibold mb-[1.111vw]">
                    Словарь
                  </h3>
                  <div className="space-y-[0.833vw]">
                    {wordUsages.slice(0, MAX_ITEMS).map((w, i) => (
                      <div key={i} className="flex items-center gap-[0.694vw]">
                        <DictionaryIcon className="size-[1.389vw] text-[#555] shrink-0" />
                        <span className="text-[0.972vw]">{w}</span>
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
