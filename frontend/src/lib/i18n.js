import { writable, derived } from "svelte/store";
import en from "../locales/en.json";
import lt from "../locales/lt.json";

const translations = { en, lt };

export const locale = writable("lt");

export const t = derived(locale, ($locale) => {
  const dict = translations[$locale] || translations.lt;

  /**
   * Resolve a dotted key like "crossword.across"
   * from the active locale dictionary.
   */
  return function translate(key) {
    const parts = key.split(".");
    let value = dict;
    for (const part of parts) {
      value = value?.[part];
    }
    return typeof value === "string" ? value : key;
  };
});
