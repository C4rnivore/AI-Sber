"use client"

import useFavoriteTranslationsStore from "@/hooks/useFavoriteTransaltions";
import FavoriteItem from "./FavoriteItem";

export default function Favorites() {
  const {favoriteTranslations, removeFavoriteTranslation} = useFavoriteTranslationsStore()
  return(
    <div className="pt-[4.167vw]">
      <h1 className="text-[1.667vw] text-[#2C734E] mb-[0.972vw] font-semibold">
        Избранные переводы
      </h1>
      <div className="w-full flex flex-col gap-[1.389vw]">
        {
          favoriteTranslations.map((item, index)=>{
            return(
              <div key={index} className="flex gap-[1.389vw]">
                <FavoriteItem sourceLanguage={item.sourceLanguage} content={item.sourceContent} />
                <FavoriteItem sourceLanguage={item.tragetLanguage} content={item.tragetContent}/>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}
