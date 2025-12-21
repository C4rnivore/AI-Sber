"use client";

import useFavoriteTranslationsStore from "@/hooks/useFavoriteTransaltionsStore";
import FavoriteItem from "../../components/favorites/FavoriteItem";

export default function Favorites() {
  const { favoriteTranslations } = useFavoriteTranslationsStore();
  return (
    <div className="pt-[4.167vw]">
      <h1 className="lg:text-[1.667vw] text-[4vw] text-[#2C734E] lg:mb-[0.972vw] mb-[3vw] font-semibold">
        Избранные переводы
      </h1>
      <div className="w-full flex flex-col-reverse gap-[1.389vw]">
        {favoriteTranslations.map((item, index) => {
          return (
            <div
              key={index}
              className="flex max-lg:flex-col lg:gap-[1.389vw] gap-[-2px] "
            >
              <FavoriteItem
                className=" max-lg:rounded-b-[0]"
                sourceLanguage={item.sourceLanguage}
                content={item.sourceContent}
              />
              <FavoriteItem
                className="max-lg:translate-y-[-1px] max-lg:rounded-t-[0] max-lg:mb-[3vw]"
                sourceLanguage={item.targetLanguage}
                content={item.targetContent}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
