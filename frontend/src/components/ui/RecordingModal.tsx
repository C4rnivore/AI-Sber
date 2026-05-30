"use client";

import MicrophoneIcon from "@/icons/MicrophoneIcon";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface RecordingModalProps {
  onComplete: (blob: Blob) => Promise<void>;
  onClose: () => void;
}

type RecordingState = "recording" | "processing" | "error";

export default function RecordingModal({
  onComplete,
  onClose,
}: RecordingModalProps) {
  const [state, setState] = useState<RecordingState>("recording");
  const [duration, setDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startedRef = useRef(false);

  const stopTracks = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
        });
        streamRef.current = stream;

        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : MediaRecorder.isTypeSupported("audio/mp4")
            ? "audio/mp4"
            : "";

        const recorder = new MediaRecorder(
          stream,
          mimeType ? { mimeType } : undefined,
        );
        mediaRecorderRef.current = recorder;
        chunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.start(250);
        timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
      } catch {
        setState("error");
        setErrorMessage(
          "Не удалось получить доступ к микрофону. Проверьте разрешения.",
        );
      }
    })();

    return () => stopTracks();
  }, [stopTracks]);

  const handleStop = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== "recording") return;

    recorder.onstop = async () => {
      stopTracks();
      const blob =
        chunksRef.current.length > 0
          ? new Blob(chunksRef.current, { type: recorder.mimeType })
          : null;

      if (!blob) {
        onClose();
        return;
      }

      setState("processing");
      try {
        await onComplete(blob);
        onClose();
      } catch {
        setState("error");
        setErrorMessage("Ошибка при распознавании речи. Попробуйте снова.");
      }
    };

    recorder.stop();
  }, [onComplete, onClose, stopTracks]);

  const handleCancel = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder?.state === "recording") {
      recorder.onstop = () => {};
      recorder.stop();
    }
    stopTracks();
    onClose();
  }, [onClose, stopTracks]);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        className="pointer-events-auto bg-white lg:rounded-[1.389vw] rounded-[5vw] lg:p-[2.222vw] p-[8vw] flex flex-col items-center lg:gap-[1.389vw] gap-[5vw] shadow-[0_8px_40px_rgba(87,207,220,0.25)] border border-[#5ACFDD50] lg:min-w-[18vw] min-w-[70vw]"
      >
        {state === "recording" && (
          <>
            <div className="relative flex items-center justify-center lg:size-[6.944vw] size-[25vw]">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-gradient-to-r from-[#57CFDC] to-[#6BB3EE]"
                  initial={{ width: "40%", height: "40%", opacity: 0.35 }}
                  animate={{
                    width: ["40%", "100%"],
                    height: ["40%", "100%"],
                    opacity: [0.3, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.2,
                    delay: i * 0.7,
                    ease: "easeOut",
                  }}
                />
              ))}
              <div className="relative z-10 lg:size-[3.472vw] size-[12.5vw] rounded-full bg-gradient-to-r from-[#57CFDC] to-[#6BB3EE] flex items-center justify-center shadow-[0_4px_20px_rgba(87,207,220,0.4)]">
                <MicrophoneIcon className="lg:size-[1.944vw] size-[7vw] text-white" />
              </div>
            </div>

            <span className="lg:text-[2.222vw] text-[8vw] font-mono font-semibold text-gradient tabular-nums">
              {formatDuration(duration)}
            </span>

            <div className="flex flex-col items-center lg:gap-[0.694vw] gap-[2.5vw] w-full">
              <button
                onClick={handleStop}
                className="w-full lg:py-[0.694vw] py-[3vw] lg:px-[2.222vw] px-[6vw] bg-gradient text-white lg:rounded-[0.694vw] rounded-[3vw] lg:text-[0.972vw] text-[4vw] font-medium transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer"
              >
                Остановить
              </button>
              <button
                onClick={handleCancel}
                className="lg:text-[0.833vw] text-[3.5vw] text-[#96969680] hover:text-[#969696] transition-colors cursor-pointer"
              >
                Отмена
              </button>
            </div>
          </>
        )}

        {state === "processing" && (
          <div className="flex flex-col items-center lg:gap-[1.111vw] gap-[4vw] lg:py-[1.111vw] py-[4vw]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="lg:size-[2.778vw] size-[10vw] rounded-full border-[3px] border-[#57CFDC30] border-t-[#57CFDC]"
            />
            <span className="lg:text-[1.111vw] text-[4vw] font-medium text-[#969696]">
              Распознавание речи...
            </span>
          </div>
        )}

        {state === "error" && (
          <div className="flex flex-col items-center lg:gap-[1.111vw] gap-[4vw]">
            <span className="lg:text-[1.111vw] text-[3.5vw] text-red-500 text-center">
              {errorMessage}
            </span>
            <button
              onClick={onClose}
              className="lg:py-[0.556vw] py-[2.5vw] lg:px-[2.222vw] px-[6vw] bg-[#f5f5f5] hover:bg-[#ebebeb] lg:rounded-[0.694vw] rounded-[3vw] lg:text-[0.972vw] text-[3.5vw] font-medium text-[#969696] transition-colors cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
