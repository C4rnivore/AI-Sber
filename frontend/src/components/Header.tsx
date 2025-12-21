/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "./ui/Button";
import useNavigationStore from "@/hooks/useNavigationStore";
import clsx from "clsx";
import ChatIcon from "@/icons/ChatIcon";
import FavoritesIcon from "@/icons/FavoritesIcon";
import HistroyIcon from "@/icons/HistroyIcon";

export default function Header() {
  const router = useRouter();
  const { navigationTab, setNavigationTab } = useNavigationStore();

  useEffect(() => {
    router.push(`/${navigationTab}`);
    setNavigationTab(navigationTab);
  }, [navigationTab]);

  return (
    <header className="w-full lg:py-[0.833vw] py-[3vw] flex lg:flex-row flex-col justify-between items-center border-b border-[#B8B8B8] lg:px-[10.417vw] px-[2.5vw] [box-shadow:0_0_5.5_0_#0000001F]">
      <div className="lg:text-[1.389vw] text-[6vw] text-[#2C734E] max-lg:mb-[2vw]">
        <span className="font-medium">AI</span> Переводчик
      </div>

      <div className="flex lg:gap-2 gap-[4.5vw]">
        <Button
          className={clsx(
            "lg:text-[1.111vw] text-[3vw] gap-[0.417vw] items-center py-[0.417vw] px-[0.833vw]",
            navigationTab === "translator" && "text-[#2C734E]"
          )}
          onClick={() => setNavigationTab("translator")}
        >
          <div className="lg:size-[1.806vw] size-[4vw]">
            <ChatIcon />
          </div>
          Переводчик
        </Button>

        <Button
          className={clsx(
            "lg:text-[1.111vw] text-[3vw] gap-[0.417vw] items-center py-[0.417vw] px-[0.833vw]",
            navigationTab === "favorites" && "text-[#2C734E]"
          )}
          onClick={() => setNavigationTab("favorites")}
        >
          <div className="lg:size-[1.806vw] size-[4vw]">
            <FavoritesIcon />
          </div>
          Избранные переводы
        </Button>

        <Button
          className={clsx(
            "lg:text-[1.111vw] text-[3vw] gap-[0.417vw] items-center py-[0.417vw] px-[0.833vw]",
            navigationTab === "history" && "text-[#2C734E]"
          )}
          onClick={() => setNavigationTab("history")}
        >
          <div className="lg:size-[1.806vw] size-[4vw]">
            <HistroyIcon />
          </div>
          История
        </Button>
      </div>
    </header>
  );
}
