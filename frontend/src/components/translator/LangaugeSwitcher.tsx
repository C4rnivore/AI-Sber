import Button from "@/components/ui/Button";
import SwitchIcon from "@/icons/SwitchIcon";
import { LanguageSwitcherProps } from "@/utils/interfaces";
import { useState } from "react";
import { motion } from "framer-motion";

const LanguageSwitcher = ({
  activeTargetLanguage,
  onChange,
}: LanguageSwitcherProps) => {
  const [rotation, setRotation] = useState(0);

  const handleSwitch = () => {
    setRotation((prev) => prev + 180);
    onChange(activeTargetLanguage === "nanai" ? "russian" : "nanai");
  };

  return (
    <div className="flex justify-between lg:px-[1.389vw] px-[6vw] relative z-[10]">
      <motion.div
        className="lg:w-[36.111vw] w-[28.75vw] flex justify-center items-center lg:text-[1.111vw] text-[3.5vw] bg-white rounded-full [box-shadow:0_0_5.5_0_#0000001F] overflow-hidden"
        key={`left-${activeTargetLanguage}`}
      >
        <motion.span
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 50, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
        >
          {activeTargetLanguage === "nanai" ? "Русский" : "Нанайский"}
        </motion.span>
      </motion.div>

      <Button
        onClick={handleSwitch}
        className="lg:size-[2.5vw] size-[9vw] items-center justify-center bg-white rounded-full [box-shadow:0_0_5.5_0_#0000001F]"
      >
        <motion.div
          className="lg:w-[1.25vw] w-[4vw] lg:h-[1.667vw]"
          animate={{ rotate: rotation }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            mass: 1,
          }}
        >
          <SwitchIcon />
        </motion.div>
      </Button>

      <motion.div
        className="lg:w-[36.111vw] w-[28.75vw] flex justify-center items-center lg:text-[1.111vw] text-[3.5vw] bg-white rounded-full [box-shadow:0_0_5.5_0_#0000001F] overflow-hidden"
        key={`right-${activeTargetLanguage}`}
      >
        <motion.span
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
        >
          {activeTargetLanguage === "nanai" ? "Нанайский" : "Русский"}
        </motion.span>
      </motion.div>
    </div>
  );
};

export default LanguageSwitcher;
