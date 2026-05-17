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
          className="lg:mt-[1.111vw] mt-[3vw] lg:rounded-[1.667vw] rounded-[5vw] bg-[linear-gradient(45deg,#58CFDD20_0%,#90C7F220_50%,#84A9ED20_100%)] lg:p-[0.139vw] p-[0.5vw] border border-[#5ACFDD50]"
        >
          <div className="bg-white/60 backdrop-blur-sm lg:rounded-[1.528vw] rounded-[4.5vw] lg:p-[1.111vw] p-[3vw]">
            <h3 className="lg:text-[0.972vw] text-[3.2vw] text-[#969696] lg:mb-[0.833vw] mb-[2.5vw] lg:ml-[0.278vw] ml-[1vw]">
              Варианты перевода
            </h3>
            <div className="lg:space-y-[0.556vw] space-y-[2vw]">
              {translations.map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                  className="bg-white lg:rounded-[0.833vw] rounded-[3vw] border border-[#96969650] lg:px-[1.111vw] px-[3vw] lg:py-[0.833vw] py-[2.5vw] lg:text-[0.972vw] text-[3.2vw]"
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
