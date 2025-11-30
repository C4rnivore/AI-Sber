"use client";

import useFavoriteTranslationsStore from "@/hooks/useFavoriteTransaltionsStore";
import FavoriteItem from "../../components/favorites/FavoriteItem";

export default function Favorites() {
  const { favoriteTranslations } = useFavoriteTranslationsStore();
  return (
    <div className="pt-[4.167vw]">
      <h1 className="text-[1.667vw] text-[#2C734E] mb-[0.972vw] font-semibold">
        Избранные переводы
      </h1>
      <div className="w-full flex flex-col-reverse gap-[1.389vw]">
        {favoriteTranslations.map((item, index) => {
          return (
            <div key={index} className="flex gap-[1.389vw]">
              <FavoriteItem
                sourceLanguage={item.sourceLanguage}
                content={item.sourceContent}
              />
              <FavoriteItem
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
