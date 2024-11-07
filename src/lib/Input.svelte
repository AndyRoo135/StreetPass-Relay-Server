<script lang="ts">
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  export let invalid: boolean;
  export let icon: IconDefinition;
  export let value: string = "";
</script>

<label class:invalid>
  <Fa
    {icon}
    fw
  />
  <input
    {...$$props}
    bind:value
    on:input
    on:change
  />
</label>

{#if $$slots.default}
  <p class="hint">
    <slot />
  </p>
{:else}<br />{/if}

<style lang="scss">
  @use "$lib/styles/colors.scss" as colors;
  @use "$lib/styles/theme.scss" as theme;
  label {
    background: light-dark(colors.primary(100), colors.primary(900));
    border-radius: 0.3rem;
    width: 100%;
    padding: 0.5rem 0.7rem;
    display: flex;
    align-content: center;
    transition:
      background 100ms ease-out,
      box-shadow 100ms ease-out,
      outline-color 100ms ease-out,
      color 100ms ease-out;
    outline: solid 0.15rem transparent;
    height: 2.5rem;
    color: light-dark(colors.accent(650), colors.accent(400));

    &:hover {
      box-shadow: 0 3px 10px -2px color-mix(in srgb, light-dark(colors.$black, colors.$white), transparent
            70%);
    }

    &.invalid {
      background-color: light-dark(colors.danger(150), colors.danger(850));
      color: light-dark(colors.danger(850), colors.danger(150));

      &:focus-within {
        color: light-dark(colors.danger(950), colors.danger(50));
        outline-color: colors.danger(500);
        input::placeholder {
          color: light-dark(colors.danger(850), colors.danger(100));
        }
      }
    }
    &:focus-within {
      background: transparent;
      box-shadow: none;
      outline-color: colors.primary(500);
      color: light-dark(colors.primary(950), colors.primary(50));
      input::placeholder {
        color: light-dark(colors.accent(650), colors.accent(400));
      }
    }

    :global(*),
    input::placeholder {
      color: inherit;
      margin: auto 0;
    }
  }

  input {
    background: transparent;
    border: none;
    margin-left: 0.6rem;
    outline: none;
    flex-grow: 1;
  }

  .hint {
    display: block;
    margin: 0.3rem 0.3rem 0.8rem;
    font-size: 0.85rem;
    font-weight: 500;
    transition: color 100ms ease-out;

    .invalid + & {
      color: light-dark(colors.danger(700), colors.danger(300));
    }
  }
</style>
