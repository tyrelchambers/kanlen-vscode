<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";
  import type { MeResponse, User } from "../shared/types";
  let currentUser: User | null = null;
  let gotTokens = false;
  let token: String | null = null;

  const login = async (email, password) => {
    await axios
      .post("http://localhost:4000/api/v1/auth/login", {
        email,
        password,
      })
      .then(async (res) => {
        const { token, user } = res.data;
        tsvscode.postMessage({
          type: "save-token",
          value: {
            token,
          },
        });
        tsvscode.postMessage({
          type: "save-user",
          value: {
            user,
          },
        });
      });
  };

  const query = async (path: string) => {
    await axios
      .get(`http://localhost:4000/api/v1/${path}`, {
        headers: {
          token,
        },
      })
      .then(async (res) => {
        const { user } = res.data;
        console.log(user);
      });
  };

  async function fetchUser() {
    if (!token) {
      return;
    }
    try {
      const r: MeResponse = await query("/user/me");
      currentUser = r.user;
      return r.user;
    } catch {}
  }

  onMount(async () => {
    tsvscode.postMessage({
      type: "get-user",
    });

    tsvscode.postMessage({
      type: "get-token",
    });
  });

  let email, password;

  window.addEventListener("message", async (event) => {
    const message = event.data;
    switch (message.command) {
      case "get-token":
        token = message.payload.token;
        gotTokens = true;
        break;

      case "get-user":
        let user = message.payload.user;
        currentUser = user;
        break;
    }
  });
</script>

{#if !token}
  <h1>Login</h1>
  <input
    type="email"
    name="email"
    placeholder="email"
    bind:value={email}
    on:input={(e) => (email = e.target.value)}
  />
  <input
    type="password"
    name="password"
    placeholder="password"
    bind:value={password}
    on:input={(e) => (password = e.target.value)}
  />

  <button on:click={() => login(email, password)}>login</button>
{/if}

{#if currentUser}
  <img src={currentUser.user.avatar} alt="" />
  <h1>{currentUser.user.name}</h1>
{/if}
