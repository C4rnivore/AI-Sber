import TextArea from "@/components/ui/TextArea";
import React, { useEffect, useState } from "react";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import useTranslationStore from "@/hooks/useTranslationStore";
import useFavoriteTranslationsStore from "@/hooks/useFavoriteTransaltionsStore";
import useSyncValues from "@/hooks/useSyncValues";
import { fetchTranslation } from "@/utils/axiosUtils";

export default function TranslationArea() {
  const {
    translateTo,
    originalText,
    setOriginalText,
    translatedText,
    setTranslatedText,
  } = useTranslationStore();
  const {
    addFavoriteTranslation,
    removeFavoriteTranslation,
    favoriteTranslations,
  } = useFavoriteTranslationsStore();
  const debouncedOriginal = useDebouncedValue(originalText, 500) as string;
  const [inFavorites, setInFavorites] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [favoriteTranslationId, setFavoriteTranslationId] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    if (isSwapping || isFetching) return;
    if (debouncedOriginal === "") {
      setTranslatedText("");
      return;
    }

    setIsFetching(true);
    fetchTranslation(debouncedOriginal, translateTo)
      .then((translatedText) => {
        setTranslatedText(translatedText);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [debouncedOriginal]);

  useEffect(() => {
    setIsSwapping(true);
    setOriginalText(translatedText);
    setTranslatedText(originalText);
    setTimeout(() => {
      setIsSwapping(false);
    }, 700);
  }, [translateTo]);

  // Проверяем, есть ли перевод в избранном
  useEffect(() => {
    const isInFavorites = favoriteTranslations.some(
      (translation) =>
        translation.targetContent === translatedText &&
        translation.sourceContent === originalText &&
        translation.targetLanguage === translateTo
    );
    setInFavorites(isInFavorites);
    setFavoriteTranslationId(
      favoriteTranslations.find(
        (translation) =>
          translation.targetContent === translatedText &&
          translation.sourceContent === originalText &&
          translation.targetLanguage === translateTo
      )?.id
    );
  }, [favoriteTranslations, translatedText, originalText, translateTo]);

  // Синхронизация высоты текстовых полей
  const {
    syncedValue: syncHeight,
    setValue1: setHeight1,
    setValue2: setHeight2,
  } = useSyncValues("max");

  const onAddToFavorites = () => {
    const id = Date.now();
    addFavoriteTranslation({
      id,
      sourceLanguage: translateTo === "nanai" ? "russian" : "nanai",
      sourceContent: originalText,
      targetLanguage: translateTo,
      targetContent: translatedText,
      createdAt: new Date(),
    });
    setInFavorites(true);
  };

  const onRemoveFromFavorites = () => {
    if (!favoriteTranslationId) return;

    removeFavoriteTranslation(favoriteTranslationId);
    setInFavorites(false);
  };

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
        disabled={isFetching}
        syncHeight={syncHeight}
        onHeightChange={setHeight2}
        className="bg-white border-[0.5px] border-[#B8B8B8] font-semibold text-[1.667vw]"
        copy={true}
        tts={true}
        onAddToFavorites={onAddToFavorites}
        inFavorites={inFavorites}
        onRemoveFromFavorites={onRemoveFromFavorites}
      />
    </div>
  );
}
