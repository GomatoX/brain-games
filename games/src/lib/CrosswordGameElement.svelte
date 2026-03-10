<svelte:options
  customElement={{
    tag: "crossword-game",
    shadow: "none",
    props: {
      puzzleId: { attribute: "puzzle-id" },
      userId: { attribute: "userid" },
      org: { attribute: "org" },
      apiUrl: { attribute: "api-url" },
      layoutSeed: { attribute: "layout-seed", type: "Number" },
      resultId: { attribute: "result-id" },
    },
  }}
/>

<script>
  import CrosswordGame from "./crossword/CrosswordGame.svelte";

  // Re-export all props from the base component
  export let puzzleId = "";
  export let userId = "";
  export let org = "";
  export let theme = "light";
  export let apiUrl = "";
  export let layoutSeed = 1;
  export let token = "";
  export let client = "";
  export let resultId = "";
  export let lang = "lt";

  // Support both "userid" and "org" attributes — org is the legacy alias
  $: resolvedUserId = userId || org;
</script>

<CrosswordGame
  {puzzleId}
  userId={resolvedUserId}
  {theme}
  {apiUrl}
  {layoutSeed}
  {token}
  {client}
  {resultId}
  {lang}
/>
