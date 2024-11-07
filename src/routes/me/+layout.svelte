<script lang="ts">
  import Fa from "svelte-fa";
  import { page } from "$app/stores";
  import {
    faArrowLeft,
    faGamepad,
    faTag,
    faUser,
    faSignOut,
    faDisplay,
    faBell,
    faUserFriends,
  } from "@fortawesome/free-solid-svg-icons";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
</script>

<form
  method="post"
  action="/logout"
  id="logout"
/>

<div class="container">
  <aside class="desktop">
    <a href="/me">
      <Fa icon={faArrowLeft} />
      My Profile
    </a>
    <div class="account">
      <img
        src={data.profilePicture}
        alt="Your Mii"
      />
      <div>
        {#if data.nickname}
          <h1>{data.nickname}</h1>
          <p>@{data.userID}</p>
        {:else}
          <h2>@{data.userID}</h2>
        {/if}
      </div>
    </div>
    <menu>
      <li class:active={$page.url.pathname == "/me/profile"}>
        <a href="/me/profile">
          <Fa
            icon={faUser}
            fw
            size="sm"
          /> Profile</a
        >
      </li>
      <li class:active={$page.url.pathname == "/me/devices"}>
        <a href="/me/devices">
          <Fa
            fw
            size="sm"
            icon={faDisplay}
          /> Devices</a
        >
      </li>
      <li class:active={$page.url.pathname == "/me/games"}>
        <a href="/me/games"
          ><Fa
            icon={faGamepad}
            size="sm"
            fw
          /> Games</a
        >
      </li>
      <li class:active={$page.url.pathname == "/me/tags"}>
        <a href="/me/tags"
          ><Fa
            icon={faTag}
            size="sm"
            fw
          /> Tags</a
        >
      </li>
      <li class:active={$page.url.pathname == "/me/notifications"}>
        <a href="/me/notifications">
          <Fa
            icon={faBell}
            size="sm"
            fw
          /> Notifications</a
        >
      </li>
      <li class:active={$page.url.pathname == "/me/users"}>
        <a href="/me/users">
          <Fa
            icon={faUserFriends}
            size="sm"
            fw
          /> Users</a
        >
      </li>
    </menu>
    <hr />
    <form
      action="/logout"
      method="post"
    >
      <button type="submit">
        <Fa
          icon={faSignOut}
          size="sm"
          fw
        />
        Log Out</button
      >
    </form>
  </aside>

  <div class="content">
    <slot />
  </div>
</div>

<style lang="scss">
  @use "$lib/styles/colors" as colors;
  .container {
    display: flex;
    flex-direction: row;
  }

  aside {
    width: 25rem;
    margin-right: 2rem;
    height: 100vh;
    padding-top: 20vh;
    padding-left: 1rem;
    padding-right: 1rem;
    background-color: light-dark(colors.primary(100), colors.primary(900));
    position: sticky;
    top: 0;

    > a {
      color: light-dark(colors.accent(600), colors.accent(300));
      &:hover {
        color: light-dark(colors.primary(600), colors.primary(200));
      }
      :global(*) {
        color: inherit;
      }
    }

    hr {
      border-style: solid;
      border-color: colors.accent(500);
      margin: 0.5rem 0.6rem;
    }

    .account {
      margin-left: 1rem;
      margin-top: 1rem;
      display: flex;

      img {
        height: 3.5rem;
        width: 3.5rem;
        border-radius: 1.75rem;
      }
      div {
        display: flex;
        flex-direction: column;
        margin-left: 0.5rem;
        justify-content: center;
      }
      h1 {
        margin: 0;
        font-size: 1.5rem;
      }
      p {
        margin: 0;
        color: colors.accent(500);
      }
    }
    menu {
      margin: 0;
      margin-top: 1rem;
      padding: 0;
      :global(*) {
        color: inherit;
      }
      a {
        display: block;
        padding: 0.5rem 1rem;
        color: var(--text);
        transition:
          background 150ms ease-out,
          color 150ms ease-out;
        border-radius: 0.4rem;
        &:hover {
          background-color: light-dark(
            colors.primary(200),
            colors.primary(800)
          );
        }
      }
      li {
        &:not(:last-child) {
          margin-bottom: 0.2rem;
        }
        &::marker {
          content: none;
        }
        &.active a {
          background-color: colors.primary(500);
          color: colors.primary(950);
          font-weight: 550;
        }
      }
    }
  }

  button {
    color: light-dark(colors.danger(500), colors.danger(350));
    background: none;
    border: none;
    border-radius: 0.4rem;
    padding: 0.5rem 1rem;
    transition:
      background 100ms ease-out,
      color 100ms ease-out;
    &:hover {
      color: light-dark(colors.danger(650), colors.danger(50));
      background: light-dark(colors.danger(150), colors.danger(450));
    }
    :global(*) {
      color: inherit;
    }
  }

  .content {
    padding-top: 8rem;
    width: 100%;
  }
</style>
