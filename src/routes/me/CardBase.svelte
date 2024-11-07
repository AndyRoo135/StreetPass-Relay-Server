<script lang="ts">
  export let cardStyle: "primary" | "secondary" | "accent" | "error" =
    "secondary";
</script>

<div class="card-container {cardStyle}"><slot /></div>

<style lang="scss">
  @use "$lib/styles/colors" as colors;
  .card-container {
    width: 100%;
    max-width: 40rem;
    border-radius: 1.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    :global(:not(button, button *)) {
      color: var(--card-color);
    }

    :global(.card-container) & {
      border-radius: 0.7rem;
    }

    &.primary {
      background: colors.primary(500);
      color: colors.primary(950);
    }
    &.secondary {
      background: light-dark(colors.primary(100), colors.primary(900));
      color: light-dark(colors.primary(950), colors.primary(50));
    }
    &.accent {
      background: light-dark(colors.accent(550), colors.accent(650));
      color: light-dark(colors.accent(50), colors.accent(50));
    }
    &.error {
      background: light-dark(colors.danger(150), colors.danger(850));
      color: light-dark(colors.danger(950), colors.danger(50));
    }
  }
</style>
