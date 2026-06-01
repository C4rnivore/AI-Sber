import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import useTranslationStore from "@/hooks/useTranslationStore";
import useAlternativeTranslationsStore from "@/hooks/useAlternativeTranslationsStore";
import useFavoriteTranslationsStore from "@/hooks/useFavoriteTransaltionsStore";
import useHistoryStore from "@/hooks/useHistoryStore";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import {
  fetchTranslation,
  fetchTextToSpeech,
  fetchSpeechToText,
  fetchOCR,
  fetchWordUsages,
  fetchSentencesUsages,
} from "@/utils/axiosUtils";

type SentenceUsage = { original: string; translated: string };

let cachedUsages = {
  word: "",
  wordUsages: [] as string[],
  sentencesUsages: [] as SentenceUsage[],
};

export default function useTranslatorController() {
  const {
    originalText,
    setOriginalText,
    translateTo,
    translateFrom,
    setTranslatedText,
    translatedText,
    setTranslateFrom,
    setTranslateTo,
  } = useTranslationStore();

  const {
    alternativeTranslations,
    addAlternativeTranslation,
    clearAlternativeTranslations,
  } = useAlternativeTranslationsStore();

  const {
    favoriteTranslations,
    addFavoriteTranslation,
    removeFavoriteTranslation,
  } = useFavoriteTranslationsStore();

  const { addHistoryTranslation } = useHistoryStore();

  const debouncedText = useDebouncedValue(originalText, 500);

  const [isTranslating, setIsTranslating] = useState(false);
  const [isAlternativePending, setIsAlternativePending] = useState(false);
  const [alternativeTranslationsCount, setAlternativeTranslationsCount] =
    useState(1);
  const alternativeFetchRef = useRef<AbortController | null>(null);
  const lastFetchedFor = useRef<string | null>(null);

  const abortAlternativeFetch = () => {
    alternativeFetchRef.current?.abort();
    alternativeFetchRef.current = null;
  };

  const isTranslationBusy = isTranslating || isAlternativePending;

  // --- Main translation ---

  useEffect(() => {
    if (debouncedText === "") {
      abortAlternativeFetch();
      setIsAlternativePending(false);
      setIsTranslating(false);
      if (lastFetchedFor.current !== null) {
        setTranslatedText("");
        clearAlternativeTranslations();
        setAlternativeTranslationsCount(1);
      }
      return;
    }

    const key = `${debouncedText}\0${translateTo}`;

    if (
      translatedText &&
      (lastFetchedFor.current === null || key === lastFetchedFor.current)
    ) {
      lastFetchedFor.current = key;
      return;
    }

    lastFetchedFor.current = key;
    abortAlternativeFetch();
    setIsAlternativePending(false);
    clearAlternativeTranslations();
    setAlternativeTranslationsCount(1);

    const controller = new AbortController();
    setIsTranslating(true);

    fetchTranslation(debouncedText, translateTo, 1, controller.signal)
      .then((text) => {
        if (!controller.signal.aborted) {
          setTranslatedText(text);
          addHistoryTranslation({
            id: Date.now(),
            sourceLanguage: translateTo === "russian" ? "nanai" : "russian",
            sourceText: debouncedText,
            targetLanguage: translateTo,
            targetText: text,
            translatedAt: new Date(),
          });
        }
      })
      .catch((err: unknown) => {
        if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") return;
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsTranslating(false);
          setAlternativeTranslationsCount(1);
        }
      });

    return () => controller.abort();
  }, [
    debouncedText,
    translateTo,
    setTranslatedText,
    clearAlternativeTranslations,
    addHistoryTranslation,
  ]);

  // --- Alternative translations ---

  const translatedWordCount = translatedText.split(" ").length;
  const showAlternativeButton = translatedWordCount > 1;
  const canFetchMoreAlternatives =
    !isTranslationBusy && alternativeTranslationsCount < translatedWordCount;

  const fetchAlternativeTranslation = useCallback(() => {
    if (isTranslationBusy) return;
    const count = alternativeTranslationsCount + 1;
    if (count > translatedText.split(" ").length) return;

    abortAlternativeFetch();
    const controller = new AbortController();
    alternativeFetchRef.current = controller;
    setIsAlternativePending(true);

    fetchTranslation(debouncedText, translateTo, count, controller.signal)
      .then((text) => {
        if (!controller.signal.aborted) {
          addAlternativeTranslation(text);
          setAlternativeTranslationsCount(count);
        }
      })
      .catch((err: unknown) => {
        if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") return;
      })
      .finally(() => {
        if (alternativeFetchRef.current === controller) {
          alternativeFetchRef.current = null;
        }
        setIsAlternativePending(false);
      });
  }, [
    isTranslationBusy,
    alternativeTranslationsCount,
    translatedText,
    debouncedText,
    translateTo,
    addAlternativeTranslation,
  ]);

  // --- Word usages ---

  const trimmedWord = debouncedText.trim();
  const isSingleWord = trimmedWord.length > 0 && !/\s/.test(trimmedWord);
  const isCached = isSingleWord && cachedUsages.word === trimmedWord;

  const [wordUsages, setWordUsages] = useState<string[]>(
    isCached ? cachedUsages.wordUsages : []
  );
  const [sentencesUsages, setSentencesUsages] = useState<SentenceUsage[]>(
    isCached ? cachedUsages.sentencesUsages : []
  );

  useEffect(() => {
    if (!isSingleWord) {
      setWordUsages([]);
      setSentencesUsages([]);
      return;
    }

    if (cachedUsages.word === trimmedWord) return;

    cachedUsages = { word: trimmedWord, wordUsages: [], sentencesUsages: [] };
    const controller = new AbortController();

    fetchWordUsages(trimmedWord, controller.signal)
      .then((translations) => {
        if (!controller.signal.aborted) {
          cachedUsages.wordUsages = translations;
          setWordUsages(translations);
        }
      })
      .catch(() => {});

    fetchSentencesUsages(trimmedWord, controller.signal)
      .then((matches) => {
        if (!controller.signal.aborted) {
          cachedUsages.sentencesUsages = matches;
          setSentencesUsages(matches);
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, [trimmedWord, isSingleWord]);

  // --- TTS ---

  const ttsFetchingRef = useRef(false);
  const cachedAudios = useRef<Record<string, string>>({});

  const handleTTS = useCallback(
    (text: string, language: "russian" | "nanai") => {
      if (ttsFetchingRef.current || !text) return;

      if (cachedAudios.current[text]) {
        const speech = new Audio(
          "data:audio/wav;base64," + cachedAudios.current[text]
        );
        speech.addEventListener("loadeddata", () => speech.play());
        return;
      }

      ttsFetchingRef.current = true;
      const controller = new AbortController();

      fetchTextToSpeech(text, language, controller.signal)
        .then((audio) => {
          if (!controller.signal.aborted && audio) {
            const speech = new Audio("data:audio/wav;base64," + audio);
            speech.addEventListener("loadeddata", () => speech.play());
            cachedAudios.current[text] = audio;
          }
        })
        .catch((err: unknown) => {
          if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") return;
        })
        .finally(() => {
          ttsFetchingRef.current = false;
        });
    },
    []
  );

  // --- STT ---

  const handleSTT = useCallback(
    async (audioBlob: Blob, language: "russian" | "nanai") => {
      const text = await fetchSpeechToText(audioBlob, language);
      if (text) {
        setOriginalText(text.slice(0, 201));
      }
    },
    [setOriginalText]
  );

  // --- OCR ---

  const handleOCR = useCallback(
    async (imageFile: File) => {
      const text = await fetchOCR(imageFile);
      if (text) {
        setOriginalText(text.slice(0, 201));
      }
    },
    [setOriginalText]
  );

  // --- Favorites ---

  const favoriteMatch = favoriteTranslations.find(
    (fav) =>
      fav.sourceContent === originalText && fav.targetContent === translatedText
  );
  const isFavorited = !!favoriteMatch;

  const handleFavoriteToggle = useCallback(() => {
    if (!originalText || !translatedText) return;
    if (favoriteMatch) {
      removeFavoriteTranslation(favoriteMatch.id);
    } else {
      addFavoriteTranslation({
        id: Date.now(),
        sourceLanguage: translateFrom,
        sourceContent: originalText,
        targetLanguage: translateTo,
        targetContent: translatedText,
        createdAt: new Date(),
      });
    }
  }, [
    originalText,
    translatedText,
    favoriteMatch,
    translateFrom,
    translateTo,
    addFavoriteTranslation,
    removeFavoriteTranslation,
  ]);

  return {
    originalText,
    translatedText,
    translateFrom,
    translateTo,
    debouncedText,

    isTranslationBusy,

    alternativeTranslations,
    showAlternativeButton,
    canFetchMoreAlternatives,

    wordUsages,
    sentencesUsages,

    isFavorited,

    setOriginalText,
    fetchAlternativeTranslation,
    handleFavoriteToggle,
    handleTTS,
    handleSTT,
    handleOCR,
    setTranslateFrom,
    setTranslateTo,
  };
}
