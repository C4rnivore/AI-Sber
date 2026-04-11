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
      className="relative hover:cursor-pointer size-[1.528vw] flex items-center justify-center text-[#96969680] hover:text-[#969696]"
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
            className="absolute top-[-1.5vw] left-0 text-[0.694vw] text-[#555] whitespace-nowrap"
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
    <div className="flex-1 bg-white rounded-[1.389vw] border border-[#96969630] p-[1.111vw] flex flex-col justify-between min-h-[10vw]">
      <div>
        <span className="text-gradient text-[0.972vw] font-semibold">
          {label}
        </span>
        <p className="mt-[0.556vw] text-[0.972vw] leading-relaxed text-[#333] whitespace-pre-wrap">
          {text}
        </p>
      </div>
      <div className="flex items-center gap-[0.417vw] mt-[0.833vw]">
        <button
          className="hover:cursor-pointer size-[1.528vw] flex items-center justify-center text-[#96969680] hover:text-[#969696]"
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
    <div className="z-1 rounded-[1.667vw] bg-[linear-gradient(45deg,#58CFDD20_0%,#90C7F220_50%,#84A9ED20_100%)] p-[0.556vw] border border-[#5ACFDD50]">
      <div className="flex gap-[0.556vw]">
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
            className="absolute top-[0.833vw] right-[0.833vw] hover:cursor-pointer size-[1.528vw] flex items-center justify-center text-[#5ACFDD] hover:text-[#4ab8c6] transition-colors"
            onClick={() => onRemove(item.id)}
          >
            <HeartIcon className="size-[1.528vw]" />
          </button>
        </div>
      </div>
    </div>
  );
}
