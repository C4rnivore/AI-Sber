import TextArea from "@/components/ui/TextArea";
import React, { useEffect, useState } from "react";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import useTranslationStore from "@/hooks/useTranslationStore";
import useFavoriteTranslationsStore from "@/hooks/useFavoriteTransaltionsStore";
import useAlternativeTranslationsStore from "@/hooks/useAlternativeTranslationsStore";
import useUsagesStore from "@/hooks/useUsagesStore";
import useHistoryStore from "@/hooks/useHistoryStore";
import useSyncValues from "@/hooks/useSyncValues";
import {
  fetchWordUsages,
  fetchSentencesUsages,
  fetchTranslation,
} from "@/utils/axiosUtils";
import LanguageSwitcher from "./LangaugeSwitcher";

export default function TranslationArea() {
  // ------------------------------ Сторы для данных ------------------------------
  const {
    translateTo,
    setTranslateTo,
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
  const { addAlternativeTranslation, clearAlternativeTranslations } =
    useAlternativeTranslationsStore();
  const { setWordUsages, setSentencesUsages, clearUsages } = useUsagesStore();
  const { addHistoryTranslation } = useHistoryStore();
  // -----------------------------------------------------------------------------------

  const debouncedOriginal = useDebouncedValue(originalText, 500) as string;
  const [inFavorites, setInFavorites] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [attemptCount, setAttemptCount] = useState<number>(1);
  const [favoriteTranslationId, setFavoriteTranslationId] = useState<
    number | undefined
  >(undefined);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  // Отключаем флаг начальной загрузки после первого рендера
  useEffect(() => {
    setIsInitialLoad(false);
  }, []);

  // Запрос на перевод при изменении debounce значения оригинального текста
  useEffect(() => {
    if (isSwapping || isFetching) return;
    if (debouncedOriginal === "") {
      clearAlternativeTranslations();
      clearUsages();
      return;
    }

    // Пропускаем запрос при начальной загрузке, если уже есть перевод
    if (isInitialLoad && translatedText) {
      return;
    }

    setIsFetching(true);
    fetchTranslation(debouncedOriginal, translateTo, attemptCount)
      .then((translatedText) => {
        setTranslatedText(translatedText);

        // Сохраняем в историю
        if (translatedText && debouncedOriginal) {
          addHistoryTranslation({
            id: Date.now(),
            sourceLanguage: translateTo === "nanai" ? "russian" : "nanai",
            sourceText: debouncedOriginal,
            targetLanguage: translateTo,
            targetText: translatedText,
            translatedAt: new Date(),
          });
        }

        if (debouncedOriginal.split(" ").length === 1) {
          // Очищаем использования перед получением новых
          fetchUsages(debouncedOriginal);
        }
      })
      .finally(() => {
        clearAlternativeTranslations();
        setIsFetching(false);
      });
  }, [debouncedOriginal]);

  // Получаем альтернативные переводы
  const fetchAlternativeTranslations = (attempt: number) => {
    if (attempt === 1) return;

    setAttemptCount(attempt);
    setIsFetching(true);

    fetchTranslation(debouncedOriginal, translateTo, attempt)
      .then((translatedText) => {
        addAlternativeTranslation(translatedText);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  const fetchUsages = (word: string) => {
    fetchWordUsages(word).then((usages) => {
      setWordUsages(usages);
    });
    fetchSentencesUsages(word).then((usages) => {
      setSentencesUsages(
        usages.map((usage) => ({
          original: usage.original,
          translation: usage.translated,
        }))
      );
    });
  };

  // Меняем местами тексты при смене языка
  useEffect(() => {
    // Пропускаем swap при начальной загрузке
    if (isInitialLoad) return;

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

  const handleLanguageChange = (lang: "nanai" | "russian") => {
    setTranslateTo(lang);
  };

  return (
    <div className="relative grid lg:grid-cols-2 lg:p-[1.389vw] lg:pt-[2.083vw] p-[6vw] pt-[16vw] gap-[1.389vw] items-stretch bg-linear-to-r from-[#D9E4D9] to-[#114711] lg:rounded-[1.111vw] rounded-[4vw] -mt-[1.042vw] z-[9]">
      <div className="lg:hidden absolute top-[4vw] left-[0] w-full">
        <LanguageSwitcher
          activeTargetLanguage={translateTo}
          onChange={handleLanguageChange}
        />
      </div>
      <TextArea
        value={originalText}
        onChange={setOriginalText}
        placeholder="Начните вводить текст..."
        maxLength={200}
        syncHeight={syncHeight}
        onHeightChange={setHeight1}
        className="bg-white border-[0.5px] border-[#B8B8B8] font-semibold lg:text-[1.667vw] text-[5vw] max-lg:min-h-[67.5vw]"
        copy={true}
        tts={true}
      />
      <TextArea
        placeholder="Здесь появится перевод..."
        value={translatedText}
        disabled={isFetching}
        syncHeight={syncHeight}
        onHeightChange={setHeight2}
        className="bg-white border-[0.5px] border-[#B8B8B8] font-semibold lg:text-[1.667vw] text-[5vw] "
        copy={true}
        tts={true}
        onAddToFavorites={onAddToFavorites}
        inFavorites={inFavorites}
        onRemoveFromFavorites={onRemoveFromFavorites}
      />

      {translatedText && (
        <button
          onClick={() => fetchAlternativeTranslations(attemptCount + 1)}
          disabled={isFetching || isSwapping}
          className="bg-white max-lg:text-[3vw] absolute lg:right-[2.083vw] right-[10vw] border-[1px] border-[#B8B8B8] disabled:opacity-50 disabled:cursor-not-allowed lg:bottom-[2.083vw] bottom-[10vw] lg:py-[0.313vw] py-[1.5vw] max-lg:pb-[1vw] lg:px-[0.726vw] px-[3vw] hover:cursor-pointer rounded-full w-max"
        >
          Перевести по-другому
        </button>
      )}
    </div>
  );
}
