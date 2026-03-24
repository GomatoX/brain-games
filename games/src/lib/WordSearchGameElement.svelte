<svelte:options
  customElement={{
    tag: "word-search-game",
    shadow: "none",
    props: {
      puzzleId: { attribute: "puzzle-id" },
      userId: { attribute: "user-id" },
      apiUrl: { attribute: "api-url" },
    },
  }}
/>

<script>
  import WordSearchGame from "./WordSearchGame.svelte";

  // Re-export all props from the base component
  export let puzzleId = "";
  export let userId = "";
  export let theme = "light";
  export let apiUrl = "";
  export let token = "";
  export let client = "";
  export let lang = "lt";
</script>

<WordSearchGame {puzzleId} {userId} {theme} {apiUrl} {token} {client} {lang} />
