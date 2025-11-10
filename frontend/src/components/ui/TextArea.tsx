"use client";

import CopyIcon from "@/icons/CopyIcon";
import SpeakerIcon from "@/icons/SpeakerIcon";
import { useEffect, useRef, useCallback, TextareaHTMLAttributes, useState } from "react";
import Button from "./Button";
import { motion } from "motion/react";


interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
  className?: string;
  showCharCount?: boolean;
  syncHeight?: number;
  copy?: boolean;
  tts?: boolean;
  onHeightChange?: (height: number) => void;
}

export default function TextArea({
  value = "",
  onChange,
  placeholder = "",
  maxLength,
  minRows = 3,
  maxRows = 10,
  className = "",
  showCharCount = true,
  syncHeight,
  onHeightChange,
  copy = false,
  tts = false,
  ...props
}: TextAreaProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const lastHeightRef = useRef<number>(0);

  // Автоматическое изменение высоты textarea
  const adjustHeight = useCallback(() => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    // Сбрасываем высоту для правильного расчета scrollHeight
    textarea.style.height = "auto";

    // Вычисляем новую высоту
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const calculatedHeight = Math.min(
      Math.max(textarea.scrollHeight, lineHeight * minRows),
      lineHeight * maxRows
    );

    // Используем syncHeight если он больше
    const finalHeight = syncHeight
      ? Math.max(calculatedHeight, syncHeight)
      : calculatedHeight;

    textarea.style.height = `${finalHeight}px`;

    // Уведомляем родителя о изменении высоты только если она изменилась
    return calculatedHeight;
  }, [minRows, maxRows, syncHeight]);

  useEffect(() => {
    const newHeight = adjustHeight();
    if (
      onHeightChange &&
      newHeight !== undefined &&
      newHeight !== lastHeightRef.current
    ) {
      lastHeightRef.current = newHeight;
      onHeightChange(newHeight);
    }
  }, [value, syncHeight, adjustHeight, onHeightChange]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) return;
    if (onChange) onChange(newValue);
  };

  const currentLength = value?.length || 0;
  const isNearLimit = maxLength && currentLength >= maxLength * 0.9;
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative w-full ">
      <textarea
        ref={textAreaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full overflow-hidden p-[1.111vw] pb-[3.333vw] rounded-lg border border-gray-300 focus:outline-none  resize-none ${className}`}
        {...props}
      />
      {copy && (
          <Button
            className="absolute bottom-[1.111vw] left-[1.111vw] size-[1.806vw]"
            onClick={() => {
              setShowTooltip(true);
              navigator.clipboard.writeText(value);
              setTimeout(() => {
                setShowTooltip(false);
              }, 500);
            }}
          >
            <motion.div 
              initial={{opacity:0}}
              animate={{
                opacity: showTooltip ? 1 : 0,
                y: showTooltip ? "-10%" : 0
              }} 
              className="absolute px-[1.111vw] top-[-100%] left-1/2 -translate-x-1/2"
            >
              Скопировано
            </motion.div>
            <CopyIcon />
          </Button>
      )}
      {tts && (
        <Button
          className="absolute bottom-[1.111vw] left-[3.333vw] size-[1.806vw]"
          onClick={() => {
            console.log("TTS");
          }}
        >
          <SpeakerIcon />
        </Button>
      )}
      {maxLength && showCharCount && (
        <div
          className={`absolute bottom-[1.111vw] right-[1.111vw] text-[1.111vw] ${
            isNearLimit ? "text-red-500" : "text-gray-400"
          }`}
        >
          {currentLength} / {maxLength}
        </div>
      )}
    </div>
  );
}
