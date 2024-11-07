<script lang="ts">
  import { page } from "$app/stores";

  export let url: string;
  export let strict: boolean = false;
</script>

<a
  href={url}
  class:active={strict
    ? $page.url.pathname == url
    : $page.url.pathname.startsWith(url)}><slot /></a
>

<style lang="scss">
  @use "$lib/styles/colors.scss" as colors;
  a {
    display: block;
    padding: 0.5rem 0.8rem;
    margin: auto;
    transition:
      background-color 100ms ease-out,
      color 100ms ease-out;
    color: light-dark(colors.primary(950), colors.primary(50));
    border-radius: 0.5rem;
    &:not(:last-child) {
      margin-right: 0.4rem;
    }
    &:hover {
      background-color: light-dark(colors.primary(100), colors.primary(800));
      color: light-dark(colors.primary(950), colors.primary(50));
    }
    &.active {
      background-color: colors.primary(500);
      color: colors.primary(950);
      font-weight: 650;
      &:hover {
        background-color: light-dark(colors.primary(400), colors.primary(600));
      }
    }
  }
</style>
