<script>
  const token = false;
</script>

{#if !token}
  <h1>Login</h1>
  <input type="email" name="email" placeholder="email" />
  <input type="password" name="password" placeholder="password" />

  <button>Get token</button>
{/if}
