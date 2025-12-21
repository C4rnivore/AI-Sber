import React from "react";
import { motion, AnimatePresence } from "motion/react";
import TextArea from "../ui/TextArea";

export default function TranslationExamples({
  alternativeTranslations,
}: {
  alternativeTranslations: string[];
}) {
  function onAddToFavorites() {}
  function onRemoveFromFavorites() {}

  return (
    <AnimatePresence mode="wait">
      {alternativeTranslations.length > 0 && (
        <motion.div
          key="translation-examples"
          id="translation-examples"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full lg:px-[10.417vw] px-[13vw] lg:pt-[1.146vw] pt-[6vw] pb-[4.219vw] mt-[1.927vw] bg-[#D9E4D9]"
        >
          <h2 className="lg:text-[1.667vw] text-[4vw] text-[#2C734E] lg:mb-[0.972vw] mb-[3vw] font-semibold">
            Варианты перевода
          </h2>

          <ul className="flex flex-col gap-[0.625vw]">
            {alternativeTranslations
              .reverse()
              .map((sentence: string, index: number) => (
                <li
                  key={index}
                  className="bg-white lg:rounded-[0.625vw] rounded-[2vw]"
                >
                  <TextArea
                    value={sentence}
                    className="border-none lg:text-[1.667vw] text-[4vw]"
                    copy
                    tts
                    interactive={false}
                    disabled
                    onAddToFavorites={onAddToFavorites}
                    onRemoveFromFavorites={onRemoveFromFavorites}
                  />
                </li>
              ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
