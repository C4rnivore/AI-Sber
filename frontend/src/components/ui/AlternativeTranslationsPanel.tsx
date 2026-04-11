import { AnimatePresence, motion } from "motion/react";

interface AlternativeTranslationsPanelProps {
  translations: string[];
}

export default function AlternativeTranslationsPanel({
  translations,
}: AlternativeTranslationsPanelProps) {
  return (
    <AnimatePresence>
      {translations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mt-[1.111vw] rounded-[1.667vw] bg-[linear-gradient(45deg,#58CFDD20_0%,#90C7F220_50%,#84A9ED20_100%)] p-[0.139vw] border border-[#5ACFDD50]"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-[1.528vw] p-[1.111vw]">
            <h3 className="text-[0.972vw] text-[#969696] mb-[0.833vw] ml-[0.278vw]">
              Варианты перевода
            </h3>
            <div className="space-y-[0.556vw]">
              {translations.map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                  className="bg-white rounded-[0.833vw] border border-[#96969650] px-[1.111vw] py-[0.833vw] text-[0.972vw]"
                >
                  {text}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
