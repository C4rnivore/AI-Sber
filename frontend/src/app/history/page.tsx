"use client";

import { useCallback, useRef } from "react";
import useHistoryStore from "@/hooks/useHistoryStore";
import HistoryItem from "@/components/history/HistoryItem";
import { fetchTextToSpeech } from "@/utils/axiosUtils";
import axios from "axios";

export default function History() {
  const { historyTranslations, removeHistoryTranslation } = useHistoryStore();

  const ttsFetchingRef = useRef(false);
  const cachedAudios = useRef<Record<string, string>>({});

  const handleTTS = useCallback(
    (text: string, language: "russian" | "nanai") => {
      if (ttsFetchingRef.current || !text) return;

      if (cachedAudios.current[text]) {
        const speech = new Audio(
          "data:audio/wav;base64," + cachedAudios.current[text]
        );
        speech.addEventListener("loadeddata", () => speech.play());
        return;
      }

      ttsFetchingRef.current = true;
      const controller = new AbortController();

      fetchTextToSpeech(text, language, controller.signal)
        .then((audio) => {
          if (!controller.signal.aborted && audio) {
            const speech = new Audio("data:audio/wav;base64," + audio);
            speech.addEventListener("loadeddata", () => speech.play());
            cachedAudios.current[text] = audio;
          }
        })
        .catch((err: unknown) => {
          if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") return;
        })
        .finally(() => {
          ttsFetchingRef.current = false;
        });
    },
    []
  );

  return (
    <div className="lg:pt-[4.167vw] pt-[12vw] lg:max-w-[60vw] max-w-[90vw] mx-auto max-md:pb-[35vw]">
      <h1 className="lg:text-[2.5vw] text-[6vw] text-center lg:mb-[2.222vw] mb-[5vw] text-gradient">
        История переводов
      </h1>

      <div className="w-full flex flex-col-reverse lg:gap-[1.389vw] gap-[4vw]">
        {historyTranslations.length === 0 ? (
          <p className="z-1 lg:text-[1.111vw] text-[3.5vw] text-center text-gradient">
            История переводов пуста
          </p>
        ) : (
          historyTranslations.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              onRemove={removeHistoryTranslation}
              onTTS={handleTTS}
            />
          ))
        )}
      </div>
    </div>
  );
}
