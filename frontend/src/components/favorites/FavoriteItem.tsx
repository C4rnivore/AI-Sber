import { useState, useCallback } from "react";
import SpeakerIcon from "@/icons/SpeakerIcon";
import CopyIcon from "@/icons/CopyIcon";
import HeartIcon from "@/icons/HeartIcon";
import { AnimatePresence, motion } from "motion/react";
import { FavoriteTranslationItem } from "@/utils/interfaces";

interface FavoriteCardProps {
  item: FavoriteTranslationItem;
  onRemove: (id: number) => void;
  onTTS: (text: string, language: "russian" | "nanai") => void;
}

function CopyButton({ text }: { text: string }) {
  const [notify, setNotify] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setNotify(true);
    setTimeout(() => setNotify(false), 1000);
  }, [text]);

  return (
    <button
      className="relative hover:cursor-pointer lg:size-[1.528vw] size-[5vw] flex items-center justify-center text-[#96969680] hover:text-[#969696]"
      onClick={handleCopy}
    >
      <CopyIcon />
      <AnimatePresence mode="wait">
        {notify && (
          <motion.div
            key="notify"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute lg:top-[-1.5vw] top-[-5vw] left-0 lg:text-[0.694vw] text-[2.5vw] text-[#555] whitespace-nowrap"
          >
            Скопировано
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

function LanguagePanel({
  language,
  text,
  onTTS,
}: {
  language: "russian" | "nanai";
  text: string;
  onTTS: (text: string, language: "russian" | "nanai") => void;
}) {
  const label = language === "nanai" ? "Нанайский" : "Русский";

  return (
    <div className="flex-1 bg-white lg:rounded-[1.389vw] rounded-[4vw] border border-[#96969630] lg:p-[1.111vw] p-[3.5vw] flex flex-col justify-between lg:min-h-[10vw] min-h-[25vw]">
      <div>
        <span className="text-gradient lg:text-[0.972vw] text-[3.2vw] font-semibold">
          {label}
        </span>
        <p className="lg:mt-[0.556vw] mt-[1.5vw] lg:text-[0.972vw] text-[3.2vw] leading-relaxed text-[#333] whitespace-pre-wrap">
          {text}
        </p>
      </div>
      <div className="flex items-center lg:gap-[0.417vw] gap-[1.5vw] lg:mt-[0.833vw] mt-[2.5vw]">
        <button
          className="hover:cursor-pointer lg:size-[1.528vw] size-[5vw] flex items-center justify-center text-[#96969680] hover:text-[#969696]"
          onClick={() => onTTS(text, language)}
        >
          <SpeakerIcon />
        </button>
        <CopyButton text={text} />
      </div>
    </div>
  );
}

export default function FavoriteItem({
  item,
  onRemove,
  onTTS,
}: FavoriteCardProps) {
  return (
    <div className="z-1 lg:rounded-[1.667vw] rounded-[5vw] bg-[linear-gradient(45deg,#58CFDD20_0%,#90C7F220_50%,#84A9ED20_100%)] lg:p-[0.556vw] p-[2vw] border border-[#5ACFDD50]">
      <div className="flex lg:flex-row flex-col lg:gap-[0.556vw] gap-[2vw]">
        <LanguagePanel
          language={item.sourceLanguage}
          text={item.sourceContent}
          onTTS={onTTS}
        />

        <div className="flex-1 relative">
          <LanguagePanel
            language={item.targetLanguage}
            text={item.targetContent}
            onTTS={onTTS}
          />
          <button
            className="absolute lg:top-[0.833vw] top-[2.5vw] lg:right-[0.833vw] right-[2.5vw] hover:cursor-pointer lg:size-[1.528vw] size-[5vw] flex items-center justify-center text-[#5ACFDD] hover:text-[#4ab8c6] transition-colors"
            onClick={() => onRemove(item.id)}
          >
            <HeartIcon className="lg:size-[1.528vw] size-[5vw]" />
          </button>
        </div>
      </div>
    </div>
  );
}
