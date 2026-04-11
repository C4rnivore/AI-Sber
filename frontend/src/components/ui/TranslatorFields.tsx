import React from "react";
import TranslationField from "./TranslationField";
import WordUsagesPanel from "./WordUsagesPanel";
import AlternativeTranslationsPanel from "./AlternativeTranslationsPanel";
import LangaugeSwitcher from "../translator/LangaugeSwitcher";
import useTranslatorController from "@/hooks/useTranslatorController";

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
    translatedText,
    translateFrom,
    translateTo,
    debouncedText,
    isTranslationBusy,
    alternativeTranslations,
    showAlternativeButton,
    canFetchMoreAlternatives,
    wordUsages,
    sentencesUsages,
    isFavorited,
    setOriginalText,
    fetchAlternativeTranslation,
    handleFavoriteToggle,
    handleTTS,
  } = useTranslatorController();

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
              onTTS={handleTTS}
            />
          </div>

          <div className="w-px h-full bg-[#96969650]" />

          <div className="w-[48%] h-full relative">
            <TranslationField
              placeholder="И здесь появится перевод..."
              value={translatedText}
              disabled={true}
              fieldLanguage={translateTo}
              isFavorited={isFavorited}
              onFavoriteToggle={
                translatedText ? handleFavoriteToggle : undefined
              }
              onTTS={handleTTS}
            />
            {isTranslationBusy && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[1.111vw] bg-white/55 backdrop-blur-[2px] pointer-events-none">
                <span className="text-[1.111vw] font-medium text-[#4a5568]">
                  Переводим
                </span>
              </div>
            )}
            {showAlternativeButton && (
              <button
                onClick={fetchAlternativeTranslation}
                disabled={!canFetchMoreAlternatives}
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

      {expanded && (
        <WordUsagesPanel
          word={debouncedText}
          wordUsages={wordUsages}
          sentencesUsages={sentencesUsages}
        />
      )}
      {expanded && (
        <AlternativeTranslationsPanel translations={alternativeTranslations} />
      )}
    </>
  );
}
