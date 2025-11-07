import TextArea from "@/components/ui/TextArea";
import React, { useEffect, useState } from "react";
import useDebouncedValue from "@/hooks/useDebouncedValue";

export default function TranslationArea() {
  const [originalText, setOriginalText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [height1, setHeight1] = useState<number>(0);
  const [height2, setHeight2] = useState<number>(0);
  const [syncHeight, setSyncHeight] = useState<number>(0);

  const debouncedOriginal = useDebouncedValue(originalText, 500) as string;

  useEffect(() => {
    if (debouncedOriginal === "") {
      setTranslatedText("");
      return;
    }

    setTranslatedText("Уже переводим...");
    const api = setTimeout(() => {
      setTranslatedText(`[Типо перевод] ${debouncedOriginal} [Типо перевод]`);
    }, 1200);

    return () => {
      clearTimeout(api);
    };
  }, [debouncedOriginal]);

  useEffect(() => {
    setSyncHeight(Math.max(height1, height2));
  }, [height1, height2]);

  return (
    <div className="grid grid-cols-2 px-[1.389vw] pb-[1.389vw] pt-[2.083vw] gap-[1.389vw] items-stretch bg-linear-to-r from-[#D9E4D9] to-[#114711] rounded-[1.111vw] -mt-[1.042vw]">
      <TextArea
        value={originalText}
        onChange={setOriginalText}
        placeholder="Начните вводить текст..."
        maxLength={200}
        syncHeight={syncHeight}
        onHeightChange={setHeight1}
        className="bg-white border-[0.5px] border-[#B8B8B8] font-semibold text-[1.667vw]"
        copy={true}
        tts={true}
      />
      <TextArea
        placeholder="Здесь появится перевод..."
        value={translatedText}
        disabled
        syncHeight={syncHeight}
        onHeightChange={setHeight2}
        className="bg-white border-[0.5px] border-[#B8B8B8] font-semibold text-[1.667vw]"
        copy={true}
        tts={true}
      />
    </div>
  );
}
