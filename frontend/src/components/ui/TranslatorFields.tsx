import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import TranslationField from "./TranslationField";
import LangaugeSwitcher from "../translator/LangaugeSwitcher";
import useTranslationStore from "@/hooks/useTranslationStore";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { fetchTranslation } from "@/utils/axiosUtils";
import useAlternativeTranslationsStore from "@/hooks/useAlternativeTranslationsStore";

interface TranslatorFieldsProps {
  expanded: boolean;
  onFocus?: () => void;
}

export default function TranslatorFields({
  expanded,
  onFocus,
}: TranslatorFieldsProps) {
  const {
    originalText,
    setOriginalText,
    translateTo,
    translateFrom,
    setTranslatedText,
    translatedText,
  } = useTranslationStore();
  const debouncedText = useDebouncedValue(originalText, 500);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isAlternativePending, setIsAlternativePending] = useState(false);
  const [alternativeTranslationsCount, setAlternativeTranslationsCount] =
    useState(1);
  const alternativeFetchRef = useRef<AbortController | null>(null);
  const { addAlternativeTranslation, clearAlternativeTranslations } =
    useAlternativeTranslationsStore();

  const abortAlternativeFetch = () => {
    alternativeFetchRef.current?.abort();
    alternativeFetchRef.current = null;
  };

  const isTranslationBusy = isTranslating || isAlternativePending;

  useEffect(() => {
    if (debouncedText === "") {
      abortAlternativeFetch();
      setIsAlternativePending(false);
      setTranslatedText("");
      setIsTranslating(false);
      clearAlternativeTranslations();
      setAlternativeTranslationsCount(1);
      return;
    }

    abortAlternativeFetch();
    setIsAlternativePending(false);
    clearAlternativeTranslations();
    setAlternativeTranslationsCount(1);

    const controller = new AbortController();
    setIsTranslating(true);

    fetchTranslation(debouncedText, translateTo, 1, controller.signal)
      .then((text) => {
        if (!controller.signal.aborted) {
          setTranslatedText(text);
        }
      })
      .catch((err: unknown) => {
        if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") return;
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsTranslating(false);
          setAlternativeTranslationsCount(1);
        }
      });

    return () => controller.abort();
  }, [
    debouncedText,
    translateTo,
    setTranslatedText,
    clearAlternativeTranslations,
  ]);

  const fetchAlternativeTranslation = () => {
    if (isTranslationBusy) return;
    const count = alternativeTranslationsCount + 1;

    if (count > translatedText.split(" ").length) return;

    abortAlternativeFetch();
    const controller = new AbortController();
    alternativeFetchRef.current = controller;
    setIsAlternativePending(true);

    fetchTranslation(debouncedText, translateTo, count, controller.signal)
      .then((text) => {
        if (!controller.signal.aborted) {
          addAlternativeTranslation(text);
          setAlternativeTranslationsCount(count);
        }
      })
      .catch((err: unknown) => {
        if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") return;
      })
      .finally(() => {
        if (alternativeFetchRef.current === controller) {
          alternativeFetchRef.current = null;
        }
        setIsAlternativePending(false);
      });
  };

  return (
    <>
      {expanded && (
        <div className="flex items-center justify-center mb-[1.597vw]">
          <LangaugeSwitcher
            isTranslating={isTranslationBusy}
            onLanguagesSwitched={() => {}}
          />
        </div>
      )}

      <div className="w-full h-full flex flex-col justify-between  bg-[linear-gradient(45deg,#58CFDD30_0%,#90C7F230_50%,#84A9ED30_100%)] backdrop-blur-xl rounded-[2.222vw] border border-[#5ACFDD50] p-[1.111vw]">
        <div className="flex justify-between items-start h-[90%] mb-[1.111vw]">
          <div className="w-[48%] h-full">
            <TranslationField
              placeholder="Начните вводить текст..."
              onFocus={onFocus}
              inputLimitation={200}
              value={originalText}
              onValueChange={setOriginalText}
              fieldLanguage={translateFrom}
            />
          </div>

          <div className="w-px h-full bg-[#96969650]" />

          <div className="w-[48%] h-full relative">
            <TranslationField
              placeholder="И здесь появится перевод..."
              value={translatedText}
              disabled={true}
              fieldLanguage={translateTo}
            />
            {isTranslationBusy && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[1.111vw] bg-white/55 backdrop-blur-[2px] pointer-events-none">
                <span className="text-[1.111vw] font-medium text-[#4a5568]">
                  Переводим
                </span>
              </div>
            )}
            {translatedText.split(" ").length > 1 && (
              <button
                onClick={fetchAlternativeTranslation}
                disabled={
                  isTranslationBusy ||
                  alternativeTranslationsCount ===
                    translatedText.split(" ").length
                }
                className="absolute bottom-[1.111vw] right-[1.111vw] text-[0.833vw] text-[#00000070] hover:cursor-pointer"
              >
                Перевести по-другому
              </button>
            )}
          </div>
        </div>

        <span className="text-[0.972vw] text-center text-[#96969650]">
          Обратите внимание: Перевод текста осуществляется при помощи алгоритмов
          искусственного интеллекта. <br />
          <strong>Всегда дополнительно проверяйте важную информацию.</strong>
        </span>
      </div>
    </>
  );
}
