"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Client component that dynamically loads the correct IIFE game engine script
 * and renders the web component (<crossword-game> or <word-game>) with
 * the appropriate attributes.
 */
interface PlayEmbedProps {
  previewToken?: string;
}

export default function PlayEmbed({ previewToken }: PlayEmbedProps) {
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  const gameId = searchParams.get("id") || "";
  const gameType = searchParams.get("type") || "crosswords";
  const userId = searchParams.get("user") || "";
  const theme = searchParams.get("theme") || "light";
  const lang = searchParams.get("lang") || "lt";
  const resultId = searchParams.get("result") || "";
  const token = searchParams.get("token") || previewToken || "";

  useEffect(() => {
    if (!containerRef.current) return;

    // Map game type to IIFE script and element tag
    const engineMap: Record<
      string,
      { script: string; tag: string; idAttr: string }
    > = {
      crosswords: {
        script: "/crossword-engine.iife.js",
        tag: "crossword-game",
        idAttr: "puzzle-id",
      },
      word: {
        script: "/word-game-engine.iife.js",
        tag: "word-game",
        idAttr: "game-id",
      },
      // sudoku: when IIFE is added
    };

    const engine = engineMap[gameType];
    if (!engine) return;

    // Load the IIFE script if not already loaded
    const existingScript = document.querySelector(
      `script[src="${engine.script}"]`,
    );

    function renderElement() {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";

      const el = document.createElement(engine.tag);

      // Always set the ID attribute — the engine handles "latest" internally
      el.setAttribute(engine.idAttr, gameId);

      el.setAttribute("theme", theme);
      el.setAttribute("api-url", window.location.origin);
      if (lang) el.setAttribute("lang", lang);
      if (userId) el.setAttribute("user-id", userId);
      if (resultId) el.setAttribute("result-id", resultId);
      if (token) el.setAttribute("token", token);

      containerRef.current.appendChild(el);
    }

    if (existingScript) {
      renderElement();
    } else {
      const script = document.createElement("script");
      script.src = engine.script;
      script.onload = renderElement;
      document.head.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [gameId, gameType, theme, lang, userId, resultId, token]);

  return <div ref={containerRef} className="w-full min-h-screen" />;
}
