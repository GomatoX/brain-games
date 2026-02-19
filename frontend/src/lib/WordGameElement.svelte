<svelte:options customElement="word-game" />

<script>
  import WordGame from "./WordGame.svelte";

  // Re-export all props from the base component
  export let gameId = "";
  export let theme = "light";
  export let apiUrl = "";
  export let showKeyboard = true;
  export let token = "";
  export let client = "";
</script>

<WordGame {gameId} {theme} {apiUrl} {showKeyboard} {token} {client} />
