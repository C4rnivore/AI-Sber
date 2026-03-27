/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import NavigationLink from "./ui/NavigationLink";
import { NavigationTabs } from "@/utils/types";

export default function Header() {
  const [currentPage, setCurrentPage] = useState<NavigationTabs>("translator");
  const handleNavigation = (tab: NavigationTabs) => {
    setCurrentPage(tab);
  };

  return (
    <header className="fixed flex items-center gap-[1.389vw] top-[1.111vw] left-1/2 -translate-x-1/2 w-max z-[100] bg-white border backdrop-blur-[24px] p-[0.347vw] pr-[2.778vw] rounded-full">
      <NavigationLink
        href="/"
        active={false}
        onNavigate={() => handleNavigation("translator")}
      >
        <img src="img/logo.png" alt="logo" className="size-[2.222vw]" />
      </NavigationLink>

      <nav>
        <ul className="flex gap-[1.111vw]">
          <NavigationLink
            active={currentPage === "translator"}
            onNavigate={() => handleNavigation("translator")}
            href="/"
          >
            <li>Переводчик</li>
          </NavigationLink>

          <NavigationLink
            active={currentPage === "favorites"}
            onNavigate={() => handleNavigation("favorites")}
            href="/favorites"
          >
            <li>Избранное</li>
          </NavigationLink>

          <NavigationLink
            active={currentPage === "history"}
            onNavigate={() => handleNavigation("history")}
            href="/history"
          >
            <li>История</li>
          </NavigationLink>

          <NavigationLink
            active={currentPage === "storyteller"}
            onNavigate={() => handleNavigation("storyteller")}
            href="/storyteller"
          >
            <li>Чтец сказок</li>
          </NavigationLink>
        </ul>
      </nav>
    </header>
  );
}
