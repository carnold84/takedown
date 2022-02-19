<script>
  export let isActive;
</script>

<button class="editor_button {isActive ? 'is_active' : ''}" on:click>
  <slot />
</button>

<style>
  .editor_button {
    @apply text-sm text-zinc-500;
    @apply border border-neutral-500 rounded-md mr-2 px-3 py-1;
  }

  .editor_button:hover {
    @apply text-zinc-300 border-neutral-200;
  }

  .editor_button.is_active {
    @apply text-zinc-300 bg-zinc-700;
  }
</style>
