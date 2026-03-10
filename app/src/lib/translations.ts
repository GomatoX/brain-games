type TranslationKeys = {
  play: {
    publishedGames: string;
    selectGame: string;
    latestGames: string;
    latest: string;
    latestType: (type: string) => string;
    playNow: string;
    play: string;
    allGames: string;
    noPublishedGames: string;
    loadingGame: string;
  };
};

const translations: Record<string, TranslationKeys> = {
  en: {
    play: {
      publishedGames: "Published Games",
      selectGame: "Select a game to play",
      latestGames: "Latest Games",
      latest: "Latest",
      latestType: (type: string) => `Latest ${type}`,
      playNow: "Play Now",
      play: "Play",
      allGames: "All Games",
      noPublishedGames: "No published games yet.",
      loadingGame: "Loading game…",
    },
  },
  lt: {
    play: {
      publishedGames: "Paskelbti žaidimai",
      selectGame: "Pasirinkite žaidimą",
      latestGames: "Naujausi žaidimai",
      latest: "Naujausia",
      latestType: (type: string) => `Naujausia: ${type}`,
      playNow: "Žaisti dabar",
      play: "Žaisti",
      allGames: "Visi žaidimai",
      noPublishedGames: "Dar nėra paskelbtų žaidimų.",
      loadingGame: "Kraunamas žaidimas…",
    },
  },
};

export const getTranslations = (lang: string): TranslationKeys => {
  return translations[lang] || translations.lt;
};
