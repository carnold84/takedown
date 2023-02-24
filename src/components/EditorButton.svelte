<script lang="ts">
  export let isActive: boolean;
</script>

<button class="editor_button {isActive ? 'is_active' : ''}" on:click>
  <slot />
</button>

<style>
  .editor_button {
    @apply text-sm text-zinc-500;
    @apply rounded-md mr-2 p-1;
  }

  .editor_button:hover {
    @apply text-zinc-300 border-neutral-200;
  }

  .editor_button.is_active {
    @apply text-zinc-200 bg-neutral-600;
  }
</style>
