<svelte:options
  customElement={{
    tag: "word-game",
    shadow: "none",
    props: {
      gameId: { attribute: "game-id" },
      apiUrl: { attribute: "api-url" },
    },
  }}
/>

<script>
  import WordGame from "./WordGame.svelte";

  // Re-export all props from the base component
  export let gameId = "";
  export let theme = "light";
  export let apiUrl = "";
  export let token = "";
  export let client = "";
  export let lang = "lt";
</script>

<WordGame {gameId} {theme} {apiUrl} {token} {client} {lang} />
