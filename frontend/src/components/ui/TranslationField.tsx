import CopyIcon from "@/icons/CopyIcon";
import SpeakerIcon from "@/icons/SpeakerIcon";
import HeartIcon from "@/icons/HeartIcon";
import HeartEmptyIcon from "@/icons/HeartEmptyIcon";
import { AnimatePresence, motion } from "motion/react";
import React, { TextareaHTMLAttributes, useState } from "react";

interface TranslationFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string;
  inputLimitation?: number;
  fieldLanguage: "russian" | "nanai";
  onValueChange?: (value: string) => void;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
  onTTS?: (text: string, language: "russian" | "nanai") => void;
}

export default function TranslationField({
  value,
  inputLimitation,
  fieldLanguage,
  onValueChange,
  isFavorited,
  onFavoriteToggle,
  onTTS,
  ...props
}: TranslationFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = inputLimitation
      ? e.target.value.slice(0, inputLimitation)
      : e.target.value;
    onValueChange?.(newValue);
  };

  const countedLength = value?.trim().replace(" ", "").length || 0;
  const isNearLimit =
    !!inputLimitation && countedLength > inputLimitation * 0.9;

  const [notify, setNotify] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value || "");
    setNotify(true);
    setTimeout(() => setNotify(false), 1000);
  };

  const handleTTSClick = () => {
    onTTS?.(value || "", fieldLanguage);
  };

  return (
    <div className="relative w-full h-full">
      <textarea
        className="w-full h-full bg-white rounded-[1.111vw] border resize-none border-[#96969650] p-[1.111vw] focus:border focus:border-red-300"
        {...props}
        value={value}
        onChange={handleChange}
      />

      {inputLimitation && !props.disabled && (
        <span
          className={`absolute bottom-[0.556vw] right-[1.111vw] text-[0.672vw] ${isNearLimit ? "text-red-500" : "text-[#96969650]"} select-none`}
        >
          {countedLength} / {inputLimitation}
        </span>
      )}

      <div className="flex absolute bottom-[1.111vw] left-[1.111vw] items-center justify-center gap-2">
        <button
          className="hover:cursor-pointer size-[1.528vw] flex items-center justify-center "
          onClick={handleTTSClick}
        >
          <SpeakerIcon />
        </button>

        <button
          className="hover:cursor-pointer size-[1.528vw] flex items-center justify-center"
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
                className="absolute top-[-1.5vw] left-0"
              >
                Скопировано
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {onFavoriteToggle && (
        <button
          className="absolute top-[0.833vw] right-[0.833vw] hover:cursor-pointer size-[1.528vw] flex items-center justify-center"
          onClick={onFavoriteToggle}
        >
          <AnimatePresence mode="wait">
            {isFavorited ? (
              <motion.div
                key="filled"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[#DAE5F9]"
              >
                <HeartIcon className="size-[1.528vw]" />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[#969696]"
              >
                <HeartEmptyIcon className="size-[1.528vw]" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      )}
    </div>
  );
}
