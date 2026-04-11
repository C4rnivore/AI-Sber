"use client";

import { useCallback, useRef } from "react";
import useFavoriteTranslationsStore from "@/hooks/useFavoriteTransaltionsStore";
import FavoriteItem from "@/components/favorites/FavoriteItem";
import { fetchTextToSpeech } from "@/utils/axiosUtils";
import axios from "axios";

export default function Favorites() {
  const { favoriteTranslations, removeFavoriteTranslation } =
    useFavoriteTranslationsStore();

  const ttsFetchingRef = useRef(false);
  const cachedAudios = useRef<Record<string, string>>({});

  const handleTTS = useCallback(
    (text: string, language: "russian" | "nanai") => {
      if (ttsFetchingRef.current || !text) return;

      if (cachedAudios.current[text]) {
        const speech = new Audio(
          "data:audio/wav;base64," + cachedAudios.current[text],
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
    [],
  );

  return (
    <div className="pt-[4.167vw] max-w-[60vw] mx-auto">
      <h1 className="text-[2.5vw] text-center mb-[2.222vw] italic text-gradient">
        Избранные переводы
      </h1>

      <div className="w-full flex flex-col-reverse gap-[1.389vw]">
        {favoriteTranslations.length === 0 ? (
          <p className="z-1 text-[1.111vw] text-center text-gray-400">
            Избранные переводы пусты
          </p>
        ) : (
          favoriteTranslations.map((item) => (
            <FavoriteItem
              key={item.id}
              item={item}
              onRemove={removeFavoriteTranslation}
              onTTS={handleTTS}
            />
          ))
        )}
      </div>
    </div>
  );
}
