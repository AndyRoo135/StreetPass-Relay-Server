<script lang="ts">
  import { fade, fly, scale } from "svelte/transition";
  import type { ActionData, PageData } from "./$types";
  import {
    faCheck,
    faCheckDouble,
    faCircleNotch,
    faEnvelope,
    faKey,
    faPen,
    faWarning,
    faXmark,
  } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import { enhance, applyAction } from "$app/forms";
  import CardBase from "../CardBase.svelte";
  import Input from "$lib/Input.svelte";

  export let data: PageData;
  export let form: ActionData;

  let bioText = data.bio;
  let bioForm: HTMLFormElement;
  let bioFormSubmitting = false;

  let toastData: string | undefined = undefined;
  $: toastData = form?.toast;
  function dismissToast() {
    toastData = undefined;
  }

  let changeEmailModal = false;
  let changePasswordModal = false;
  let deleteAccountModal = false;

  const openChangeEmailModal = () => (changeEmailModal = true);
  const closeChangeEmailModal = () => {
    changeEmailModal = false;
    if (form) {
      form.password = undefined;
      form.email = undefined;
    }
  };

  const openChangePasswordModal = () => (changePasswordModal = true);
  const closeChangePasswordModal = () => {
    changePasswordModal = false;
    if (form) {
      form.password = undefined;
      form.newPassword = undefined;
      form.confirmPassword = undefined;
    }
  };

  let newPassword = "";
  let newPasswordOK = true;
  let passwordGates = {
    lowercase: false,
    uppercase: false,
    symbol: false,
    number: false,
    length: false,
  };
  const passwordGateTexts: Record<string, string> = {
    lowercase: "At least 1 lowercase letter",
    uppercase: "At least 1 uppercase letter",
    symbol: "At least 1 symbol",
    number: "At least 1 number",
    length: "At least 8 characters long",
  };
  function onPasswordChange() {
    passwordGates.lowercase = !!newPassword.match(/[a-z]/);
    passwordGates.uppercase = !!newPassword.match(/[A-Z]/);
    passwordGates.symbol = !!newPassword.match(/[\W_]/);
    passwordGates.number = !!newPassword.match(/[0-9]/);
    passwordGates.length = newPassword.length >= 8;
  }

  const openDeleteAccountModal = () => (deleteAccountModal = true);
  const closeDeleteAccountModal = () => (deleteAccountModal = false);
</script>

<svelte:head>
  <title>Profile Settings | StreetRelay</title>
</svelte:head>

{#if toastData}
  <div
    class="toast"
    transition:fly={{ opacity: 0, y: -10 }}
  >
    {toastData}
    <button on:click={dismissToast}
      ><Fa
        icon={faXmark}
        size="1x"
      /></button
    >
  </div>
{/if}

<h1>Profile</h1>
<CardBase>
  <div class="profile">
    <div class="avatar">
      <p><b>Profile Photo</b></p>
      <img
        src={data.profilePicture}
        alt="Your Avatar"
      />
    </div>
    <div class="text">
      <p>
        Nickname:
        {#if data.nickname}
          <b>{data.nickname}</b>
        {:else}
          <i>not uploaded yet</i>
        {/if}
      </p>
      <p>User ID: <b>{data.userID}</b></p>
    </div>
  </div>
  <p style:margin-top="0.5rem">
    <i>
      To change your avatar or nickname, sync your console.<br />Your Mii is
      automatically uploaded every time you sync
    </i>
  </p>
  <form
    action="?/updateBio"
    bind:this={bioForm}
    use:enhance={() => {
      bioFormSubmitting = true;
      return async ({ result }) => {
        bioFormSubmitting = false;
        await applyAction(result);
      };
    }}
    method="POST"
  >
    <p style:margin-top="0.5rem"><b>About You</b></p>
    <textarea
      bind:value={bioText}
      on:input={() => {
        if (form) {
          form.bio = undefined;
        }
      }}
      on:change={() => {
        bioForm.requestSubmit();
      }}
      name="bio"
      placeholder="Type a short bio about yourself"
    ></textarea>
    <span class="bioText">
      <p
        class="count"
        class:error={(bioText?.length ?? 0) >= 180}
      >
        {bioText?.length ?? 0}/200
      </p>
      {#if bioFormSubmitting}
        <p class="status">
          <Fa
            icon={faCircleNotch}
            spin
          /> Submitting
        </p>
      {:else if form?.bio === true}
        <p class="status">
          <Fa icon={faCheck} /> Saved
        </p>
      {:else if form?.bio !== undefined}
        <p class="status error">
          <Fa icon={faXmark} />
          {form?.bio}
        </p>
      {/if}
    </span>
  </form>
</CardBase>

<h2>Account and Security</h2>
<CardBase>
  {#if !data.emailVerified}
    <form method="post">
      <CardBase cardStyle="error">
        <form
          use:enhance
          method="post"
          action="?/resendEmailVerification"
        >
          <div
            style:display="flex"
            style:align-items="center"
            style:margin-bottom="0.5rem"
          >
            <Fa icon={faWarning} />
            <p style:margin-left="1rem">
              Your email has not yet been verified. Verify it to be able to
              receive notifications, and to recover your account if you forget
              the password.
            </p>
          </div>
          {#if data.canSendVerification}
            <button class="button error">Resend Verification Email</button>
          {:else if form?.resendVerification === true}
            <p>
              Email verification has been resent. Check your inbox and spam
              folders
            </p>
          {:else}
            {#if form?.resendVerification === false}
              <p>Could not resend verification. Click to resend</p>
            {/if}
            <p>
              You can resend the verification email again in {data.canSendVerificationAgain}
              minutes
            </p>
          {/if}
        </form>
      </CardBase>
    </form>
  {/if}
  <p>Email address: <b>{data.email}</b></p>
  <button
    class="button"
    on:click={openChangeEmailModal}>Change Email</button
  >
</CardBase>
<CardBase>
  <p><b>Change Password</b></p>
  <button
    class="button"
    on:click={openChangePasswordModal}>Change Password</button
  >
</CardBase>

<h2>Delete Account</h2>
<CardBase cardStyle="error">
  <p>
    Click the button below to delete your account. This action is irreversable.
  </p>
  <button
    class="button error"
    on:click={openDeleteAccountModal}>Delete Account</button
  >
</CardBase>

{#if changeEmailModal}
  <button
    class="modal-backdrop"
    transition:fade={{ duration: 150 }}
    on:click={closeChangeEmailModal}
  />
  <form
    class="modal"
    action="?/changeEmail"
    method="post"
    transition:scale={{ start: 0.9, duration: 150 }}
    use:enhance={() => {
      return async ({ result }) => {
        await applyAction(result);
        if (result.type === "success") closeChangeEmailModal();
      };
    }}
  >
    <h1>Change your email address</h1>
    <p>A verification email will be sent to your new address</p>

    <Input
      icon={faKey}
      type="password"
      name="password"
      placeholder="Current password"
      autocomplete="current-password"
      invalid={form?.password !== undefined}
    >
      {#if form?.password}
        {form?.password}
      {/if}
    </Input>

    <Input
      icon={faEnvelope}
      type="email"
      name="email"
      placeholder="New email address"
      autocomplete="email"
      invalid={form?.email !== undefined}
    >
      {#if form?.email}
        {form?.email}
      {/if}
    </Input>

    <div class="buttons">
      <button
        type="button"
        on:click={closeChangeEmailModal}>Cancel</button
      >
      <button class="submit">Change</button>
    </div>
  </form>
{/if}

{#if changePasswordModal}
  <button
    class="modal-backdrop"
    transition:fade={{ duration: 150 }}
    on:click={closeChangePasswordModal}
  />
  <form
    class="modal"
    action="?/changePassword"
    method="post"
    transition:scale={{ start: 0.9, duration: 150 }}
    use:enhance={() => {
      return async ({ result }) => {
        await applyAction(result);
        if (result.type === "success") closeChangePasswordModal();
      };
    }}
  >
    <h1>Change Password</h1>
    <p>
      Enter your current password, and your new password.<br />Your new password
      must fulfil the listed requirements
    </p>
    <Input
      icon={faKey}
      type="password"
      name="currentPassword"
      placeholder="Current password"
      autocomplete="current-password"
      invalid={form?.password !== undefined}
    >
      {#if form?.password}
        <p>{form.password}</p>
      {/if}
    </Input>
    <Input
      bind:value={newPassword}
      on:change={() => {
        onPasswordChange();
        newPasswordOK = Object.values(passwordGates).every((v) => v === true);
      }}
      on:input={onPasswordChange}
      icon={faPen}
      type="password"
      name="newPassword"
      placeholder="New password"
      autocomplete="new-password"
      invalid={!newPasswordOK || form?.newPassword !== undefined}
    >
      <span class="passwordGates">
        {#each Object.entries(passwordGates) as [name, fulfilled]}
          <span class:fulfilled>
            <Fa
              icon={fulfilled ? faCheck : faXmark}
              size="1x"
              fw
            />
            {passwordGateTexts[name]}
          </span>
        {/each}
      </span>
    </Input>

    <Input
      icon={faCheckDouble}
      type="password"
      name="confirmPassword"
      placeholder="Confirm new password"
      autocomplete="new-password"
      invalid={false}
    />

    <div class="buttons">
      <button
        type="button"
        on:click={closeChangePasswordModal}>Cancel</button
      >
      <button class="submit">Change Password</button>
    </div>
  </form>
{/if}

{#if deleteAccountModal}
  <button
    class="modal-backdrop"
    transition:fade={{ duration: 150 }}
    on:click={closeDeleteAccountModal}
  />
  <form
    class="modal"
    action="?/deleteAccount"
    method="post"
    transition:scale={{ start: 0.9, duration: 150 }}
  >
    <h1>Delete your StreetRelay account?</h1>
    <p>
      If you delete your account, all your StreetPass game data will be deleted.
      Your data will still be on your console. You will lose all your tags,
      those who have tagged you, your stars, and those who have starred you.
    </p>
    <em>Are you sure you want to proceed?</em>
    <span class="buttons">
      <button
        type="button"
        on:click={closeDeleteAccountModal}>Cancel</button
      >
      <button
        type="submit"
        class="delete">Delete Account</button
      >
    </span>
  </form>
{/if}

<style lang="scss">
  @use "$lib/styles/colors" as colors;
  h1 {
    font-size: x-large;
  }

  p {
    display: block;
    margin: 0;
    margin-bottom: 0.3rem;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .profile {
    display: flex;
    gap: 1rem;
    align-items: center;

    img {
      border-radius: 0.5rem;
    }
    .avatar {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .text {
      display: flex;
      flex-direction: column;
    }
  }

  textarea {
    background-color: light-dark(colors.accent(150), colors.accent(800));
    border: none;
    padding: 0.5rem 0.7rem;
    border-radius: 0.5rem;
    transition:
      background 100ms ease-out,
      box-shadow 100ms ease-out,
      outline-color 100ms ease-out,
      color 100ms ease-out;
    outline: solid 0.1rem transparent;
    width: 70%;
    height: 6rem;
    resize: none;
  }
  .bioText {
    color: light-dark(colors.accent(650), colors.accent(300));
    display: flex;
    justify-content: space-between;
    width: 70%;
    .count {
      justify-self: start;
    }
    .status {
      justify-self: end;
    }
    :global(*) {
      color: inherit !important;
    }
    .error {
      font-weight: 570;
      color: light-dark(colors.danger(500), colors.danger(400)) !important;
    }
  }

  .button {
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    background-color: light-dark(colors.accent(550), colors.accent(700));
    color: light-dark(colors.accent(50), colors.accent(50));
    transition: background 100ms ease-out;
    &:hover {
      background-color: light-dark(colors.accent(600), colors.accent(650));
    }
    &.error {
      background-color: light-dark(colors.danger(500), colors.danger(650));
      color: light-dark(colors.danger(50), colors.danger(50));
      &:hover {
        background-color: light-dark(colors.danger(600), colors.danger(550));
      }
    }
  }

  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: color-mix(in srgb, var(--background), var(--error) 5%);
    max-width: 35rem;
    padding: 2rem;
    border-radius: 1rem;

    .buttons {
      display: flex;
      gap: 0.5rem;
      padding-top: 0.5rem;
      justify-content: end;
    }
  }
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    border: none;
  }
  .modal .buttons button {
    height: 2.5rem;
    padding: 0;
    background: none;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
  }
  .modal .buttons button.submit {
    background-color: var(--accent);
    color: var(--on-accent);
    padding: 0 1rem;
  }
  .modal .buttons button.delete {
    background-color: var(--error);
    padding: 0 0.8rem;
  }

  .toast {
    position: fixed;
    background: var(--accent);
    color: var(--on-accent);
    padding: 1rem 0.9rem 1rem 1.25rem;
    border-radius: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  .toast :global(*) {
    color: inherit;
  }
  .toast button {
    border: none;
    height: 1.5rem;
    width: 1.5rem;
    display: grid;
    place-items: center;
    border-radius: 1rem;
    background: transparent;
    transition: background 100ms ease-out;
  }
  .toast button:hover {
    background-color: color-mix(in srgb, var(--accent), var(--background) 20%);
  }

  .passwordGates {
    font-size: inherit;
    color: color-mix(in srgb, var(--text), var(--error) 60%);
  }
  .passwordGates span {
    font-size: inherit;
    display: flex;
    align-items: center;
    margin-top: 0.2rem;
    color: inherit;
  }
  .passwordGates span :global(*) {
    margin-right: 0.1rem;
    color: inherit;
  }
  .passwordGates span.fulfilled {
    color: var(--text);
  }
</style>
