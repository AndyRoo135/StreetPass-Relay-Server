import { browser } from "$app/environment";
import { writable } from "svelte/store";

const initialTheme = browser && localStorage.getItem("theme");

export const theme = writable<undefined | "light" | "dark">(
  initialTheme === "light"
    ? "light"
    : initialTheme === "dark"
    ? "dark"
    : undefined
);
export default theme;

theme.subscribe((value) => {
  if (browser) {
    localStorage.setItem("theme", value ?? "unset");
  }
});
