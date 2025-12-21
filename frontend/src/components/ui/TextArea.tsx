"use client";

import CopyIcon from "@/icons/CopyIcon";
import SpeakerIcon from "@/icons/SpeakerIcon";
import { useEffect, useRef, useCallback, useState } from "react";
import Button from "./Button";
import { motion } from "motion/react";
import HeartIcon from "@/icons/HeartIcon";
import HeartEmptyIcon from "@/icons/HeartEmptyIcon";
import { TextAreaProps } from "@/utils/interfaces";
import clsx from "clsx";

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
  onAddToFavorites,
  onRemoveFromFavorites,
  inFavorites = false,
  interactive = true,
  onWordSelect,
  ...props
}: TextAreaProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const lastHeightRef = useRef<number>(0);

  // Обработка выделения слова
  const handleSelectionChange = useCallback(() => {
    if (!onWordSelect || !textAreaRef.current) return;

    const textarea = textAreaRef.current;
    const selectedText = textarea.value
      .substring(textarea.selectionStart, textarea.selectionEnd)
      .trim();
    if (
      selectedText &&
      !selectedText.includes(" ") &&
      selectedText.length > 0
    ) {
      onWordSelect(selectedText);
    } else if (selectedText === "") {
      onWordSelect(null);
    }
  }, [onWordSelect]);

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
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={"relative w-full rounded-lg"}>
      {onAddToFavorites && value.length > 0 && (
        <div
          className="lg:size-[1.806vw] size-[5vw] flex items-center justify-center cursor-pointer absolute lg:right-[1.111vw] right-[4vw] lg:top-[1.111vw] top-[4vw]"
          onClick={() => {
            if (inFavorites) {
              onRemoveFromFavorites?.();
            } else {
              onAddToFavorites?.();
            }
          }}
        >
          {inFavorites ? <HeartIcon /> : <HeartEmptyIcon />}
        </div>
      )}
      <textarea
        ref={textAreaRef}
        value={value}
        onChange={handleChange}
        onSelect={handleSelectionChange}
        onMouseUp={handleSelectionChange}
        onKeyUp={handleSelectionChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={clsx(
          `w-full overflow-hidden lg:p-[1.111vw] p-[4vw] lg:pb-[3.333vw] pb-[13vw] rounded-lg border border-gray-300 focus:outline-none  resize-none`,
          props.disabled && interactive ? "!bg-gray-200" : "",
          className
        )}
        {...props}
      />
      {copy && (
        <Button
          className="absolute lg:bottom-[1.111vw] bottom-[4vw] lg:left-[1.111vw] left-[12vw] lg:size-[1.806vw] size-[5vw]"
          onClick={() => {
            setShowTooltip(true);
            navigator.clipboard.writeText(value);
            setTimeout(() => {
              setShowTooltip(false);
            }, 500);
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: showTooltip ? 1 : 0,
              y: showTooltip ? "-10%" : 0,
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
          className="absolute lg:bottom-[1.111vw] bottom-[4vw] lg:left-[3.333vw] left-[4vw] lg:size-[1.806vw] size-[5vw]"
          onClick={() => {
            console.log("TTS");
          }}
        >
          <SpeakerIcon />
        </Button>
      )}
      {maxLength && showCharCount && (
        <div
          className={`absolute lg:bottom-[1.111vw] bottom-[4vw] lg:right-[1.111vw] right-[4vw] lg:text-[1.111vw] text-[3.75vw] ${
            isNearLimit ? "text-red-500" : "text-gray-400"
          }`}
        >
          {currentLength} / {maxLength}
        </div>
      )}
    </div>
  );
}
