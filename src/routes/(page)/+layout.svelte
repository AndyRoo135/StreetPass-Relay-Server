<script lang="ts">
  import Navbar from "./Navbar.svelte";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
</script>

<Navbar
  loggedIn={data.loggedIn}
  userID={data.userID}
  nickname={data.nickname}
  profilePhoto={data.profilePicture}
/>
<slot />
