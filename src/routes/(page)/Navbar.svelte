
<script lang="ts">
  import Fa from "svelte-fa";
  import NavbarItem from "./NavbarItem.svelte";
  import {
    faGamepad,
    faUser,
    faTag,
    faBell,
  } from "@fortawesome/free-solid-svg-icons";

  export let loggedIn: boolean;
  export let userID: string | null;
  export let nickname: string | null;
  export let profilePhoto: string | null;
</script>

<nav>
  <p class="hero">StreetRelay</p>
  <span
    class="items"
    class:shown={true}
  >
    <NavbarItem
      url="/"
      strict>Home</NavbarItem
    >
    <NavbarItem url="/games">Games</NavbarItem>
    <NavbarItem url="/users">Users</NavbarItem>
  </span>
  <span class="right">
    {#if loggedIn}
      <form
        class="profile"
        method="post"
        action="/logout"
      >
        <a
          class="avatar"
          href="/me"
        >
          <img
            src={profilePhoto}
            alt="Your avatar"
          />
        </a>
        <menu class="dropdown">
          <li class="id">
            {#if nickname}
              <b>{nickname}</b>
              {userID}
            {:else}
              <b>{userID}</b>
            {/if}
          </li>
          <li>
            <a href="/me/profile"
              ><Fa
                icon={faUser}
                fw
              /> Profile</a
            >
          </li>
          <li>
            <a href="/me/games">
              <Fa
                icon={faGamepad}
                fw
              /> Games</a
            >
          </li>
          <li>
            <a href="/me/tags">
              <Fa
                icon={faTag}
                fw
              /> Tags</a
            >
          </li>
          <li>
            <a href="/me/notifications">
              <Fa
                icon={faBell}
                fw
              /> Notifications</a
            >
          </li>
          <button class="logout">Log Out</button>
        </menu>
      </form>
    {:else}
      <a
        href="/login"
        class="button secondary">Log In</a
      >
      <a
        href="/get-started"
        class="button primary">Get Started</a
      >
    {/if}
  </span>
</nav>

<style lang="scss">
  @use "$lib/styles/colors.scss" as colors;
  @use "$lib/styles/font.scss" as font;
  nav {
    display: flex;
    align-content: center;
    justify-content: start;
    width: 100vw;
    height: 4rem;
    padding: 0 1.25rem;
    position: relative;
  }

  .hero {
    font-family: font.$display;
    font-weight: 600;
    font-size: 1.2em;
    margin: auto 1rem auto 0 !important;
    display: block;
  }

  nav > span {
    display: flex;
    align-content: center;
  }
  nav > span > * {
    margin: auto 0;
  }
  nav > span > *:not(:last-child) {
    margin-right: 0.3rem;
  }

  .right {
    margin-left: auto;
  }

  .profile {
    position: relative;

    img {
      height: 2.5rem;
      width: 2.5rem;
      border-radius: 1.25rem;
    }

    .avatar:hover + .dropdown,
    .dropdown:hover {
      opacity: 100;
      pointer-events: all;
    }

    .dropdown {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      width: max-content;
      background-color: light-dark(colors.accent(100), colors.accent(800));
      color: light-dark(colors.accent(950), colors.accent(50));
      position: absolute;
      top: 100%;
      right: 0;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      opacity: 0;
      transition: opacity 200ms ease-out;
      transition-delay: 100m;
      pointer-events: none;
      margin: 0;

      .id {
        font-size: 1.2rem !important;
        margin: 0.5rem 0;
        color: light-dark(colors.accent(600), colors.accent(400));

        b {
          font-size: inherit;
          color: light-dark(colors.accent(750), colors.accent(200));
        }
      }
      a {
        display: block;
        color: light-dark(colors.accent(600), colors.accent(300));
        padding: 0.25rem 0.5rem;
        padding-right: 2rem;
        border-radius: 0.5rem;
        transition:
          color 100ms ease-out,
          background-color 100ms ease-out;
        &:hover {
          color: light-dark(colors.accent(100), colors.accent(900));
          background-color: light-dark(colors.accent(600), colors.accent(400));
        }
      }
      button {
        display: block;
        background: light-dark(colors.danger(250), colors.danger(650));
        padding: 0.5rem 0.25rem;
        border-radius: 0.3rem;
        transition:
          color 100ms ease-out,
          background-color 100ms ease-out;
        color: light-dark(colors.danger(950), colors.danger(50));
        border: none;
        margin-top: 0.3rem;
        &:hover {
          background-color: light-dark(colors.danger(350), colors.danger(600));
        }
      }
    }
  }
  .button {
    display: block;
    margin: auto;
    transition:
      background-color 100ms ease-out,
      color 100ms ease-out;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;

    &.primary {
      background-color: colors.primary(500);
      color: colors.primary(950);
      font-weight: 650;
      &:hover {
        background-color: light-dark(colors.primary(400), colors.primary(600));
      }
    }

    &.secondary {
      background-color: light-dark(colors.primary(100), colors.primary(850));
      color: light-dark(colors.primary(950), colors.primary(50));
      &:hover {
        background-color: light-dark(colors.primary(200), colors.primary(800));
      }
    }
  }
</style>
