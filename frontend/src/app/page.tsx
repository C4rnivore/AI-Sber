"use client";
import useTranslationStore from "@/hooks/useTranslationStore";
import useAlternativeTranslationsStore from "@/hooks/useAlternativeTranslationsStore";
import useUsagesStore from "@/hooks/useUsagesStore";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TranslatorFields from "@/components/ui/TranslatorFields";

export default function Translator() {
  const [translatorMode, setTranslatorMode] = useState<
    "expanded" | "collapsed"
  >("collapsed");

  const { alternativeTranslations } = useAlternativeTranslationsStore();
  const { translateTo, setTranslateTo } = useTranslationStore();
  const { wordUsages, sentencesUsages } = useUsagesStore();
  const handleLanguageChange = (lang: "nanai" | "russian") => {
    setTranslateTo(lang);
  };

  return (
    <div className="relative z-2 w-full h-full">
      {/* Заголовок и описание */}
      <AnimatePresence mode="wait">
        {translatorMode === "collapsed" && (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute left-0 top-[50%] translate-y-[-50%] w-[30.556vw]  "
          >
            <h1 className="text-[4.444vw] font-bold leading-[.8] -translate-x-[0.25vw] text-gradient">
              MY.HERITAGE
            </h1>
            <div className="text-[1.111vw] mb-[1.111vw] text-gradient">
              Маленькие языки — Большие возможности
            </div>
            <h2 className="text-[1.111vw] mb-[1.111vw] text-gradient">
              Переводите там, где раньше это было невозможным. <br /> Наш
              переводчик помогает в работе с малоресурсными
              <br /> языками: — быстро, точно и доступно.
            </h2>
            <Button
              onClick={() => {
                setTranslatorMode("expanded");
              }}
              className="text-[0.972vw] bg-gradient text-white py-[0.556vw] px-[1.111vw] rounded-[0.556vw]"
            >
              <span>Попробовать</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Поля для перевода */}
      <motion.div
        initial={{
          left: translatorMode === "collapsed" ? "50%" : "50%",
          translateX: translatorMode === "collapsed" ? "0%" : "-50%",
          opacity: 0,
        }}
        animate={{
          left: translatorMode === "collapsed" ? "50%" : "50%",
          translateX: translatorMode === "collapsed" ? "0%" : "-50%",
          opacity: 1,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-[73.403vw] h-[30.417vw] absolute top-[50%] translate-y-[-50%] "
      >
        <TranslatorFields
          expanded={translatorMode === "expanded"}
          onFocus={() => setTranslatorMode("expanded")}
        />
      </motion.div>
    </div>
  );
}
