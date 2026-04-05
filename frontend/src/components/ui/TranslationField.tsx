import CopyIcon from "@/icons/CopyIcon";
import SpeakerIcon from "@/icons/SpeakerIcon";
import { AnimatePresence, motion } from "motion/react";
import React, { TextareaHTMLAttributes, useRef, useState } from "react";
import { fetchTextToSpeech } from "@/utils/axiosUtils";
import axios from "axios";

interface TranslationFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string;
  inputLimitation?: number;
  fieldLanguage: "russian" | "nanai";
  onValueChange?: (value: string) => void;
}

export default function TranslationField({
  value,
  inputLimitation,
  fieldLanguage,
  onValueChange,
  ...props
}: TranslationFieldProps) {
  // TODO: Разбить логику на отдельные хуки

  // Текст
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Обрезаем текст по максимальной длине, если попытались, например, вставить слишком большой текст
    var newValue = inputLimitation
      ? e.target.value.slice(0, inputLimitation)
      : e.target.value;

    onValueChange?.(newValue);
  };
  const countedLength = value?.trim().replace(" ", "").length || 0;
  const isNearLimit =
    !!inputLimitation && countedLength > inputLimitation * 0.9;

  // Копирование
  const [notify, setNotify] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value || "");
    setNotify(true);
    setTimeout(() => {
      setNotify(false);
    }, 1000);
  };

  // Аудио
  const [isFetchingTTS, setIsFetchingTTS] = useState(false);
  const cachedAudios = useRef<Record<string, string>>({});

  const handleTTS = () => {
    if (isFetchingTTS || !value) return;
    const controller = new AbortController();

    if (cachedAudios.current[value]) {
      var speech = new Audio(
        "data:audio/wav;base64," + cachedAudios.current[value],
      );
      speech.addEventListener("loadeddata", () => {
        speech.play();
      });
    } else {
      setIsFetchingTTS(true);
      fetchTextToSpeech(value || "", fieldLanguage, controller.signal)
        .then((audio) => {
          if (!controller.signal.aborted && audio) {
            var speech = new Audio("data:audio/wav;base64," + audio);
            speech.addEventListener("loadeddata", () => {
              speech.play();
            });

            cachedAudios.current[value] = audio;
          }
        })
        .catch((err: unknown) => {
          if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") return;
        })
        .finally(() => {
          if (controller.signal.aborted) return;

          setIsFetchingTTS(false);
        });
    }
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
          onClick={handleTTS}
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
    </div>
  );
}
