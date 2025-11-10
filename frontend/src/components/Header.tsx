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
    <header className="w-full py-[0.833vw] flex justify-between items-center border-b border-[#B8B8B8] px-[10.417vw] [box-shadow:0_0_5.5_0_#0000001F]">
      <div className="text-[1.389vw] text-[#2C734E]">
        <span className="font-medium">CБЕР</span> Переводчик
      </div>

      <div className="flex gap-2">
        <Button
          className={clsx(
            "text-[1.111vw] gap-[0.417vw] items-center py-[0.417vw] px-[0.833vw]",
            navigationTab === "translator" && "text-[#2C734E]"
          )}
          onClick={() => setNavigationTab("translator")}
        >
          <div className="size-[1.806vw]">
            <ChatIcon />
          </div>
          Переводчик
        </Button>

        <Button
          className={clsx(
            "text-[1.111vw] gap-[0.417vw] items-center py-[0.417vw] px-[0.833vw]",
            navigationTab === "favorites" && "text-[#2C734E]"
          )}
          onClick={() => setNavigationTab("favorites")}
        >
          <div className="size-[1.806vw]">
            <FavoritesIcon />
          </div>
          Избранные переводы
        </Button>

        <Button
          className={clsx(
            "text-[1.111vw] gap-[0.417vw] items-center py-[0.417vw] px-[0.833vw]",
            navigationTab === "history" && "text-[#2C734E]"
          )}
          onClick={() => setNavigationTab("history")}
        >
          <div className="size-[1.806vw]">
            <HistroyIcon />
          </div>
          История
        </Button>
      </div>
    </header>
  );
}
