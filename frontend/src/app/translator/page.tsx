"use client";
import LanguageSwitcher from "../../components/translator/LangaugeSwitcher";
import TranslationArea from "../../components/translator/TranslationArea";
import useTranslationStore from "@/hooks/useTranslationStore";

export default function Translator() {
  const { translateTo, setTranslateTo } = useTranslationStore();
  const handleLanguageChange = (lang: "nanai" | "russian") => {
    setTranslateTo(lang);
  };

  return (
    <div className="pt-[4.167vw]">
      <h1 className="text-[1.667vw] text-[#2C734E] mb-[0.972vw] font-semibold">
        Нанайско-русский онлайн переводчик
      </h1>
      <LanguageSwitcher
        activeTargetLanguage={translateTo}
        onChange={handleLanguageChange}
      />
      <TranslationArea />
    </div>
  );
}
