<script lang="ts">
  import { faXmark } from "@fortawesome/free-solid-svg-icons";
  import { createEventDispatcher } from "svelte";
  import Fa from "svelte-fa";
  import { fly } from "svelte/transition";

  export let content: string | undefined;
  export let type: "accent" | "error" = "accent";

  const dispatch = createEventDispatcher();
</script>

{#if content}
  <div
    class="toast {type}"
    transition:fly={{ opacity: 0, y: -10 }}
  >
    {content}
    <button on:click={() => dispatch("dismiss")}>
      <Fa
        icon={faXmark}
        size="1x"
      />
    </button>
  </div>
{/if}

<style lang="scss">
  @use "$lib/styles/colors.scss" as colors;

  .toast {
    position: absolute;
    background: light-dark(colors.primary(200), colors.primary(700));
    color: light-dark(colors.primary(950), colors.primary(50));
    padding: 1rem 0.9rem 1rem 1.25rem;
    border-radius: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    align-items: center;
    :global(*) {
      color: inherit;
    }
    button {
      border: none;
      height: 1.5rem;
      width: 1.5rem;
      display: grid;
      place-items: center;
      border-radius: 1rem;
      background: transparent;
      transition: background 100ms ease-out;
      &:hover {
        background-color: light-dark(colors.primary(400), colors.primary(800));
      }
    }
    &.error {
      background: light-dark(colors.danger(500), colors.danger(550));
      color: light-dark(colors.danger(50), colors.danger(50));
      button:hover {
        background-color: light-dark(colors.danger(600), colors.danger(650));
      }
    }
  }
</style>
