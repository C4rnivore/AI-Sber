"use client";

import SwitchIcon from "@/icons/SwitchIcon";
import React from "react";
import useTranslationStore from "@/hooks/useTranslationStore";
import LanguageDropdown from "../ui/LanguageDropdown";

export default function LangaugeSwitcher({
  isTranslating,
  onLanguagesSwitched,
}: {
  onLanguagesSwitched: () => void;
  isTranslating: boolean;
}) {
  const { translateTo, setTranslateTo, translateFrom, setTranslateFrom } =
    useTranslationStore();

  const SwitchLanguages = () => {
    setTranslateTo(translateTo === "nanai" ? "russian" : "nanai");
    setTranslateFrom(translateFrom === "nanai" ? "russian" : "nanai");
    onLanguagesSwitched();
  };

  return (
    <div className="relative z-50 flex justify-between items-center w-max gap-[2.222vw] bg-[linear-gradient(45deg,#58CFDD30_0%,#90C7F230_50%,#84A9ED30_100%)] backdrop-blur-xl rounded-full border border-[#5ACFDD50] p-[0.494vw]">
      <LanguageDropdown
        options={[
          { value: "nanai", label: "Нанайский" },
          { value: "russian", label: "Русский" },
        ]}
        value={translateFrom}
        onChange={(value) => setTranslateFrom(value)}
        disabled={isTranslating}
      />

      <button
        type="button"
        onClick={SwitchLanguages}
        disabled={isTranslating}
        className="lg:size-[2.308vw] rounded-full flex items-center justify-center bg-white hover:cursor-pointer"
      >
        <div className="lg:size-[0.672vw] -translate-y-[0.1vw]">
          <SwitchIcon />
        </div>
      </button>

      <LanguageDropdown
        options={[
          { value: "russian", label: "Русский" },
          { value: "nanai", label: "Нанайский" },
        ]}
        value={translateTo}
        onChange={(value) => setTranslateTo(value)}
        disabled={isTranslating}
      />
    </div>
  );
}
