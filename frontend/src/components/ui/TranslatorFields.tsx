import React from "react";
import TranslationField from "./TranslationField";
import WordUsagesPanel from "./WordUsagesPanel";
import AlternativeTranslationsPanel from "./AlternativeTranslationsPanel";
import LangaugeSwitcher from "../translator/LangaugeSwitcher";
import useTranslatorController from "@/hooks/useTranslatorController";
import SwitchIcon from "@/icons/SwitchIcon";

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
    setTranslateFrom,
    setTranslateTo,
  } = useTranslatorController();

  const SwitchLanguages = () => {
    setTranslateTo(translateTo === "nanai" ? "russian" : "nanai");
    setTranslateFrom(translateFrom === "nanai" ? "russian" : "nanai");
  };

  return (
    <>
      {expanded && (
        <div className="lg:flex hidden items-center justify-center mb-[1.597vw]">
          <LangaugeSwitcher
            isTranslating={isTranslationBusy}
            onLanguagesSwitched={() => {}}
          />
        </div>
      )}

      <div className="w-full h-full flex flex-col justify-between bg-[linear-gradient(45deg,#58CFDD30_0%,#90C7F230_50%,#84A9ED30_100%)] backdrop-blur-xl lg:rounded-[2.222vw] rounded-[7.5vw] border border-[#5ACFDD50] lg:p-[1.111vw] p-[2.222vw]">
        <div className="flex lg:flex-row flex-col justify-between items-start h-[90%] mb-[1.111vw]">
          <div className="lg:w-[48%] w-full lg:h-full h-[50.667vw] max-md:mb-[2.222vw]">
            <TranslationField
              placeholder="Начните вводить текст..."
              onFocus={onFocus}
              inputLimitation={200}
              value={originalText}
              onValueChange={setOriginalText}
              fieldLanguage={translateFrom}
              onTTS={handleTTS}
              onTranslateLanguageChange={setTranslateFrom}
            />
          </div>

          <div className="lg:block hidden w-px h-full bg-[#96969650]" />

          <button
            type="button"
            onClick={SwitchLanguages}
            disabled={isTranslationBusy}
            className="lg:hidden  lg:size-[2.308vw] z-1 shadow-[2px_2px_10px_rgba(0,0,0,0.1)] size-[11.944vw] max-md:rotate-90 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] rounded-full flex items-center justify-center bg-white hover:cursor-pointer"
          >
            <div className="lg:size-[0.672vw] size-[3.889vw] lg:-translate-y-[0.1vw] -translate-y-[0.5vw]">
              <SwitchIcon />
            </div>
          </button>

          <div className="lg:w-[48%] w-full lg:h-full h-[50.667vw] relative">
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
              onTranslateLanguageChange={setTranslateTo}
            />
            {isTranslationBusy && (
              <div className=" absolute inset-0 z-10 lg:flex items-center justify-center rounded-[1.111vw] bg-white/55 backdrop-blur-[2px] pointer-events-none">
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

        <span className="lg:block hidden text-[0.972vw] text-center text-[#96969650]">
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
