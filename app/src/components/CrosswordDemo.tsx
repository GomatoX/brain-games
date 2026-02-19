"use client";
import { useEffect, useRef } from "react";

interface CrosswordDemoProps {
  puzzleId: string;
  apiUrl: string;
}

// Extend HTMLElement to include our custom element's props
interface CrosswordGameElement extends HTMLElement {
  puzzleId: string;
  apiUrl: string;
  theme: string;
}

export default function CrosswordDemo({
  puzzleId,
  apiUrl,
}: CrosswordDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create the custom element after the script has loaded
    const element = document.createElement(
      "crossword-game",
    ) as CrosswordGameElement;

    // Set both attributes (for HTML) AND properties (for Svelte)
    element.setAttribute("puzzle-id", puzzleId);
    element.setAttribute("api-url", apiUrl);

    // Also set as JS properties - Svelte custom elements use camelCase props
    element.puzzleId = puzzleId;
    element.apiUrl = apiUrl;
    element.theme = "light";

    element.style.width = "100%";
    element.style.minHeight = "500px";
    element.style.display = "block";

    // Clear container and append
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(element);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [puzzleId, apiUrl]);

  return <div ref={containerRef} />;
}
