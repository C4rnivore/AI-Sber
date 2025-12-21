"use client";

import useHistoryStore from "@/hooks/useHistoryStore";
import HistoryItem from "../../components/history/HistoryItem";

export default function History() {
  const { historyTranslations, removeHistoryTranslation } = useHistoryStore();

  return (
    <div className="pt-[4.167vw]">
      <h1 className="lg:text-[1.667vw] text-[4vw] text-[#2C734E] lg:mb-[0.972vw] mb-[3vw] font-semibold">
        История переводов
      </h1>
      <div className="w-full flex flex-col-reverse lg:gap-[1.389vw] gap-[4vw]">
        {historyTranslations.length === 0 ? (
          <p className="lg:text-[1.111vw] text-[3.5vw] text-gray-500">
            История переводов пуста
          </p>
        ) : (
          historyTranslations.map((item) => {
            return (
              <div
                key={item.id}
                className="flex flex-col lg:gap-[0.694vw] gap-[2vw]"
              >
                <div className="flex max-lg:flex-col lg:gap-[1.389vw] gap-[-2px]">
                  <HistoryItem
                    className="max-lg:rounded-b-[0]"
                    sourceLanguage={item.sourceLanguage}
                    content={item.sourceText}
                  />
                  <HistoryItem
                    className="max-lg:translate-y-[-1px] max-lg:rounded-t-[0]"
                    sourceLanguage={item.targetLanguage}
                    content={item.targetText}
                  />
                </div>
                <div className="flex justify-between items-center lg:px-[0.5vw] px-[2vw]">
                  <span className="lg:text-[0.972vw] text-[3vw] text-gray-500">
                    {new Date(item.translatedAt).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <button
                    onClick={() => removeHistoryTranslation(item.id)}
                    className="text-red-600 hover:text-red-800 lg:text-[0.972vw] text-[3vw] font-semibold lg:px-[0.694vw] px-[2vw] lg:py-[0.347vw] py-[1vw] hover:bg-red-50 rounded transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
