/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import NavigationLink from "./ui/NavigationLink";
import { NavigationTabs } from "@/utils/types";
import ChatIcon from "@/icons/ChatIcon";
import HistroyIcon from "@/icons/HistroyIcon";
import FavoritesIcon from "@/icons/FavoritesIcon";
import HeadphonesIcon from "@/icons/HeadphonesIcon";

export default function Header() {
  const [currentPage, setCurrentPage] = useState<NavigationTabs>("translator");
  const handleNavigation = (tab: NavigationTabs) => {
    setCurrentPage(tab);
  };

  return (
    <header className="fixed flex items-center lg:gap-[1.389vw] gap-0 lg:top-[1.111vw] lg:bottom-auto bottom-[8.889vw] left-1/2 -translate-x-1/2 lg:w-max w-[73.333vw] z-100 bg-white border backdrop-blur-xl lg:p-[0.347vw] p-[2.5vw] lg:pr-[2.778vw] rounded-full">
      <NavigationLink
        href="/"
        active={false}
        onNavigate={() => handleNavigation("translator")}
        className="max-md:hidden"
      >
        <img src="img/logo.png" alt="logo" className="size-[2.222vw]" />
      </NavigationLink>

      <nav className="max-md:w-full">
        <ul className="flex lg:gap-[1.111vw] max-md:w-full max-md:justify-around max-md:flex">
          <NavigationLink
            active={currentPage === "translator"}
            onNavigate={() => handleNavigation("translator")}
            href="/"
          >
            <div className="max-md:block hidden size-[8.889vw]">
              <ChatIcon />
            </div>
            <li className="max-md:hidden">Переводчик</li>
          </NavigationLink>

          <NavigationLink
            active={currentPage === "favorites"}
            onNavigate={() => handleNavigation("favorites")}
            href="/favorites"
          >
            <div className="max-md:block hidden size-[8.889vw]">
              <FavoritesIcon />
            </div>
            <li className="max-md:hidden">Избранное</li>
          </NavigationLink>

          <NavigationLink
            active={currentPage === "history"}
            onNavigate={() => handleNavigation("history")}
            href="/history"
          >
            <div className="max-md:block hidden size-[8.889vw]">
              <HistroyIcon />
            </div>
            <li className="max-md:hidden">История</li>
          </NavigationLink>

          <NavigationLink
            active={currentPage === "storyteller"}
            onNavigate={() => handleNavigation("storyteller")}
            href="/storyteller"
          >
            <div className="max-md:block hidden size-[8.889vw]">
              <HeadphonesIcon />
            </div>
            <li className="max-md:hidden">Чтец сказок</li>
          </NavigationLink>
        </ul>
      </nav>
    </header>
  );
}
