import Button from "@/components/ui/Button";
import SwitchIcon from "@/icons/SwitchIcon";
import { LanguageSwitcherProps } from "@/utils/interfaces";

const LanguageSwitcher = ({
  activeTargetLanguage,
  onChange,
}: LanguageSwitcherProps) => {
  return (
    <div className="flex justify-between gap-5 px-[1.389vw]">
      <div className="w-[36.111vw] flex justify-center items-center text-[1.111vw] bg-white rounded-full [box-shadow:0_0_5.5_0_#0000001F]">
        {activeTargetLanguage === "nanai" ? "Русский" : "Нанайский"}
      </div>

      <Button
        onClick={() =>
          onChange(activeTargetLanguage === "nanai" ? "russian" : "nanai")
        }
        className="size-[2.5vw] items-center justify-center bg-white rounded-full [box-shadow:0_0_5.5_0_#0000001F]"
      >
        <div className="w-[1.25vw] h-[1.667vw]">
          <SwitchIcon />
        </div>
      </Button>

      <div className="w-[36.111vw] flex justify-center items-center text-[1.111vw]  bg-white rounded-full [box-shadow:0_0_5.5_0_#0000001F]">
        {activeTargetLanguage === "nanai" ? "Нанайский" : "Русский"}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
