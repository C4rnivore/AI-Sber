"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import useInstallPrompt from "@/hooks/useInstallPrompt";

export default function InstallPrompt() {
  const { canInstall, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  const visible = canInstall && !dismissed;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed lg:bottom-[1.5vw] bottom-[25vw] left-1/2 -translate-x-1/2 z-200 w-max"
        >
          <div className="flex items-center lg:gap-[0.833vw] gap-[3vw] bg-white/90 backdrop-blur-xl border border-[#5ACFDD50] lg:rounded-[1.111vw] rounded-[4vw] lg:px-[1.389vw] px-[4vw] lg:py-[0.833vw] py-[3vw] shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
            <span className="lg:text-[0.972vw] text-[3.2vw] text-[#333]">
              Установить приложение?
            </span>

            <button
              onClick={promptInstall}
              className="bg-gradient text-white lg:text-[0.833vw] text-[3vw] lg:px-[1.111vw] px-[3.5vw] lg:py-[0.417vw] py-[1.5vw] lg:rounded-[0.556vw] rounded-[2.5vw] hover:cursor-pointer"
            >
              Установить
            </button>

            <button
              onClick={() => setDismissed(true)}
              className="lg:text-[0.833vw] text-[3vw] text-[#96969680] hover:text-[#969696] hover:cursor-pointer"
            >
              Позже
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
