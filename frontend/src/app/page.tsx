/* eslint-disable @next/next/no-img-element */
"use client";
import useTranslatorModeStore from "@/hooks/useTranslatorModeStore";
import Button from "@/components/ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import TranslatorFields from "@/components/ui/TranslatorFields";
import { useMediaQuery } from "usehooks-ts";

export default function Translator() {
  const { translatorMode, setTranslatorMode } = useTranslatorModeStore();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const hideHero = isMobile || translatorMode === "collapsed";

  return (
    <div className="relative z-2 w-full h-full">
      <AnimatePresence mode="wait">
        {hideHero && (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="lg:absolute lg:left-0 lg:top-[50%] lg:translate-y-[-50%] lg:w-[30.556vw]  max-md:flex max-md:flex-col max-md:items-center max-md:justify-center max-md:mt-[16.667vw]"
          >
            <div className="max-md:flex max-md:flex-row max-md:gap-[3.333vw] max-md:items-center max-md:justify-center max-md:mb-[5.556vw]">
              <img
                src="img/logo.png"
                alt="logo"
                className="lg:hidden block size-[14.444vw]"
              />
              <div>
                <h1 className="lg:text-[4.444vw] text-[11.111vw] font-bold leading-[.8] -translate-x-[0.25vw] text-gradient">
                  MY.HERITAGE
                </h1>
                <div className="lg:text-[1.111vw] text-[3.333vw] lg:mb-[1.111vw] text-gradient">
                  Маленькие языки — Большие возможности
                </div>
              </div>
            </div>

            <h2 className="lg:text-[1.111vw] text-[3.333vw] mb-[1.111vw] max-md:text-center text-gradient">
              Переводите там, где раньше это было невозможным. <br /> Наш
              переводчик помогает в работе с малоресурсными
              <br /> языками: — быстро, точно и доступно.
            </h2>
            <Button
              onClick={() => setTranslatorMode("expanded")}
              className="lg:block hidden text-[0.972vw] bg-gradient text-white py-[0.556vw] px-[1.111vw] rounded-[0.556vw]"
            >
              <span>Попробовать</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{
          left: hideHero ? "50%" : "50%",
          translateX: hideHero ? "0%" : "-50%",
          opacity: 0,
        }}
        animate={{
          left: hideHero ? "50%" : "50%",
          translateX: hideHero ? "0%" : "-50%",
          opacity: 1,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="lg:w-[73.403vw] w-full lg:h-[30.417vw] h-auto lg:absolute lg:top-[50%] lg:translate-y-[-50%] max-md:mt-[5.667vw]"
      >
        <TranslatorFields
          expanded={translatorMode === "expanded"}
          onFocus={() => setTranslatorMode("expanded")}
        />
      </motion.div>
    </div>
  );
}
