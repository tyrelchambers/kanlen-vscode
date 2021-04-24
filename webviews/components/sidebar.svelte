<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";
  import type { User } from "../shared/types";
  import { apiBaseUrl } from "../../src/constants";

  let currentUser: User | null = null;
  let myToken: String | null = null;
  let snippets: Array<any> = [];

  const login = async (email: string, password: string) => {
    await axios
      .post(`${apiBaseUrl}/auth/login`, {
        email,
        password,
      })
      .then(async ({ success }) => {
        const { token, user } = success.data;
        myToken = token;
        currentUser = user;
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
        usersSnippets(myToken);
      });
  };

  const usersSnippets = async (token: string) => {
    await axios
      .get(`${apiBaseUrl}/snippets/me`, {
        headers: {
          token: token,
        },
      })
      .then(({ success }) => {
        snippets = [...success.data.snippets];
        tsvscode.postMessage({
          type: "save-snippets",
          value: success.data.snippets,
        });
      });
  };

  const saveSnippet = async (name: string, snippet: any) => {
    await axios
      .post(
        `${apiBaseUrl}/snippets/save`,
        {
          name,
          snippet,
        },
        {
          headers: {
            token: myToken,
          },
        }
      )
      .then((res) => {
        tsvscode.postMessage({
          type: "onInfo",
          value: "Snippet saved",
        });

        tsvscode.postMessage({
          type: "onInfo",
          value: "Refresh the window to update intellisense with new command",
        });
      })
      .catch((err) => {
        tsvscode.postMessage({
          type: "onError",
          value: err.response.data,
        });
      });
  };

  onMount(async () => {
    await tsvscode.postMessage({
      type: "get-token",
    });

    tsvscode.postMessage({
      type: "get-user",
    });

    tsvscode.postMessage({
      type: "get-snippets",
    });
  });

  let email: string, password: string;

  window.addEventListener("message", async (event) => {
    const message = event.data;
    switch (message.command) {
      case "get-token":
        myToken = message.payload.token.token;
        break;

      case "get-user":
        let user = message.payload.user;

        currentUser = user;
        break;

      case "get-snippets":
        myToken = message.payload.token.token;

        usersSnippets(myToken);
        break;

      case "save-snippet":
        const { name, snippet } = message.payload;
        saveSnippet(name, snippet);
        break;

      case "logout":
        myToken = null;
        break;
    }
  });

  const copyToClipboard = (text) => {
    tsvscode.postMessage({
      type: "write-clipboard",
      value: text,
    });
  };
</script>

{#if !myToken}
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

  <p>
    Or, <a href="https://kanlen.ca/signup">signup.</a>
  </p>
{/if}

{#if currentUser}
  <h2>Good day, {currentUser.name}!</h2>
  <h3>Your Snippets</h3>
  <ul class="snippet-list">
    {#if snippets.length > 0}
      {#each snippets as s}
        <li class="snippet-item" on:click={() => copyToClipboard(s.snippet)}>
          <p>{s.name}</p>
        </li>
      {/each}
    {/if}
  </ul>
{/if}

<style>
  h3 {
    margin-bottom: 1em;
    margin-top: 1em;
  }

  h2,
  h1 {
    margin-top: 1.5em;
    margin-bottom: 1.5em;
  }
  .snippet-list {
    padding: 0;
  }
  .snippet-item {
    background-color: var(--vscode-button-background);
    list-style-type: none;
    padding: 1em;
    border-radius: 5px;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    cursor: pointer;
  }
</style>
