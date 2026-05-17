import CopyIcon from "@/icons/CopyIcon";
import SpeakerIcon from "@/icons/SpeakerIcon";
import MicrophoneIcon from "@/icons/MicrophoneIcon";
import CameraIcon from "@/icons/CameraIcon";
import HeartIcon from "@/icons/HeartIcon";
import HeartEmptyIcon from "@/icons/HeartEmptyIcon";
import { AnimatePresence, motion } from "motion/react";
import React, {
  TextareaHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import LanguageDropdown from "./LanguageDropdown";
import RecordingModal from "./RecordingModal";

interface TranslationFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string;
  inputLimitation?: number;
  fieldLanguage: "russian" | "nanai";
  onValueChange?: (value: string) => void;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
  onTTS?: (text: string, language: "russian" | "nanai") => void;
  onSTT?: (audioBlob: Blob, language: "russian" | "nanai") => Promise<void>;
  onOCR?: (imageFile: File) => Promise<void>;
  onTranslateLanguageChange: (value: "russian" | "nanai") => void;
}

export default function TranslationField({
  value,
  inputLimitation,
  fieldLanguage,
  onValueChange,
  isFavorited,
  onFavoriteToggle,
  onTTS,
  onSTT,
  onOCR,
  onTranslateLanguageChange,
  ...props
}: TranslationFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = inputLimitation
      ? e.target.value.slice(0, inputLimitation)
      : e.target.value;
    onValueChange?.(newValue);
  };

  const countedLength = value?.trim().replace(" ", "").length || 0;
  const isNearLimit =
    !!inputLimitation && countedLength > inputLimitation * 0.9;

  const [notify, setNotify] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value || "");
    setNotify(true);
    setTimeout(() => setNotify(false), 1000);
  };

  const handleTTSClick = () => {
    onTTS?.(value || "", fieldLanguage);
  };

  const [isRecordingOpen, setIsRecordingOpen] = useState(false);

  // --- OCR ---
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isOCRProcessing, setIsOCRProcessing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const handleCameraClick = () => {
    if (isMobile) {
      setShowImagePicker((prev) => !prev);
    } else {
      galleryInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onOCR) return;

    setShowImagePicker(false);
    setIsOCRProcessing(true);
    try {
      await onOCR(file);
    } finally {
      setIsOCRProcessing(false);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    }
  };

  return (
    <div className="relative w-full h-full">
      <LanguageDropdown
        options={[
          { value: "nanai", label: "Нанайский" },
          { value: "russian", label: "Русский" },
        ]}
        value={fieldLanguage}
        onChange={(value) => onTranslateLanguageChange(value)}
        className="lg:hidden absolute "
        // disabled={isTranslating}
      />
      <textarea
        className="w-full h-full bg-white lg:rounded-[1.111vw] rounded-[5.833vw] border resize-none lg:border-[#96969650] lg:p-[1.111vw] p-[10.889vw_4.444vw_8.889vw_4.444vw] focus:border focus:border-red-300"
        {...props}
        value={value}
        onChange={handleChange}
      />

      {inputLimitation && !props.disabled && (
        <span
          className={`absolute lg:bottom-[0.556vw] lg:top-auto bottom-auto top-[3.5vw] lg:right-[1.111vw] right-[3.5vw] lg:text-[0.672vw] text-[3.333vw] ${
            isNearLimit ? "text-red-500" : "text-[#96969650]"
          } select-none`}
        >
          {countedLength} / {inputLimitation}
        </span>
      )}

      <div className="flex absolute lg:bottom-[1.111vw] bottom-[2.7vw] lg:left-[1.111vw] left-[3.5vw] items-center justify-center gap-2">
        <button
          className="hover:cursor-pointer lg:size-[1.528vw] size-[6.111vw] flex items-center justify-center "
          onClick={handleTTSClick}
        >
          <SpeakerIcon />
        </button>

        <button
          className="hover:cursor-pointer lg:size-[1.528vw] size-[6.111vw] flex items-center justify-center"
          onClick={handleCopy}
        >
          <CopyIcon />
          <AnimatePresence mode="wait">
            {notify && (
              <motion.div
                key="notify"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-[-1.5vw] left-0"
              >
                Скопировано
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {onSTT && (
          <button
            className="hover:cursor-pointer lg:size-[1.528vw] size-[6.111vw] flex items-center justify-center"
            onClick={() => setIsRecordingOpen(true)}
          >
            <MicrophoneIcon />
          </button>
        )}

        {onOCR && (
          <div className="relative">
            <button
              className="hover:cursor-pointer lg:size-[1.528vw] size-[6.111vw] flex items-center justify-center"
              onClick={handleCameraClick}
            >
              <CameraIcon />
            </button>

            <AnimatePresence>
              {showImagePicker && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowImagePicker(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 lg:mb-[0.556vw] mb-[2vw] z-50 bg-white lg:rounded-[0.694vw] rounded-[3vw] border border-[#5ACFDD50] shadow-[0_4px_20px_rgba(87,207,220,0.2)] lg:p-[0.417vw] p-[1.5vw] flex flex-col lg:gap-[0.139vw] gap-[0.5vw] whitespace-nowrap"
                  >
                    <button
                      onClick={() => {
                        galleryInputRef.current?.click();
                        setShowImagePicker(false);
                      }}
                      className="lg:text-[0.833vw] text-[3.5vw] lg:px-[1.111vw] px-[4vw] lg:py-[0.417vw] py-[2vw] lg:rounded-[0.417vw] rounded-[2vw] hover:bg-[#57CFDC15] active:bg-[#57CFDC25] transition-colors text-left cursor-pointer text-[#4a5568]"
                    >
                      Из галереи
                    </button>
                    <button
                      onClick={() => {
                        cameraInputRef.current?.click();
                        setShowImagePicker(false);
                      }}
                      className="lg:text-[0.833vw] text-[3.5vw] lg:px-[1.111vw] px-[4vw] lg:py-[0.417vw] py-[2vw] lg:rounded-[0.417vw] rounded-[2vw] hover:bg-[#57CFDC15] active:bg-[#57CFDC25] transition-colors text-left cursor-pointer text-[#4a5568]"
                    >
                      Сделать фото
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>

      {isRecordingOpen && onSTT && (
        <RecordingModal
          onComplete={async (blob) => {
            await onSTT(blob, fieldLanguage);
          }}
          onClose={() => setIsRecordingOpen(false)}
        />
      )}

      {isOCRProcessing && (
        <div className="absolute inset-0 z-10 flex items-center justify-center lg:rounded-[1.111vw] rounded-[5.833vw] bg-white/60 backdrop-blur-[2px] pointer-events-none">
          <div className="flex items-center lg:gap-[0.556vw] gap-[2vw]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="lg:size-[1.389vw] size-[5vw] rounded-full border-2 border-[#57CFDC30] border-t-[#57CFDC]"
            />
            <span className="lg:text-[1.111vw] text-[3.5vw] font-medium text-gradient">
              Распознавание...
            </span>
          </div>
        </div>
      )}

      {onFavoriteToggle && (
        <button
          className="absolute lg:top-[0.833vw] top-[3.5vw] lg:right-[0.833vw] right-[3.5vw] hover:cursor-pointer lg:size-[1.528vw] size-[5vw] flex items-center justify-center"
          onClick={onFavoriteToggle}
        >
          <AnimatePresence mode="wait">
            {isFavorited ? (
              <motion.div
                key="filled"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[#DAE5F9]"
              >
                <HeartIcon className="lg:size-[1.528vw] size-[5vw]" />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[#969696]"
              >
                <HeartEmptyIcon className="lg:size-[1.528vw] size-[5vw]" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      )}
    </div>
  );
}
