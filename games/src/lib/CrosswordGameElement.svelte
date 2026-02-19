<svelte:options customElement="crossword-game" />

<script>
  import CrosswordGame from "./crossword/CrosswordGame.svelte";

  // Re-export all props from the base component
  export let puzzleId = "";
  export let theme = "light";
  export let apiUrl = "";
  export let layoutSeed = 1;
  export let token = "";
  export let client = "";
  export let lang = "lt";
</script>

<CrosswordGame
  {puzzleId}
  {theme}
  {apiUrl}
  {layoutSeed}
  {token}
  {client}
  {lang}
/>
