<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import EditorButton from './EditorButton.svelte';

  const dispatch = createEventDispatcher();

  let element;
  let editor;
  export let content;

  onMount(() => {
    editor = new Editor({
      autofocus: true,
      content,
      editorProps: {
        attributes: {
          class: 'editor_styles',
        },
      },
      element,
      extensions: [StarterKit],
      onTransaction: () => {
        // force re-render so `editor.isActive` works as expected
        editor = editor;
      },
      onUpdate: ({ editor }) => {
        const json = editor.getJSON();

        console.log(json);

        dispatch('change', { json });
      },
    });
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });
</script>

<div class="w-full h-full">
  <div
    class="w-full flex items-center h-14 bg-neutral-900 border-b border-neutral-600 px-5"
  >
    {#if editor}
      <EditorButton
        isActive={editor.isActive('heading', { level: 1 })}
        on:click={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </EditorButton>
      <EditorButton
        isActive={editor.isActive('heading', { level: 2 })}
        on:click={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </EditorButton>
      <EditorButton
        isActive={editor.isActive('paragraph')}
        on:click={() => editor.chain().focus().setParagraph().run()}
      >
        P
      </EditorButton>
    {/if}
  </div>

  <div bind:this={element} class="h-full w-full bg-neutral-900" />
</div>

<style scoped>
  :global(.editor_styles) {
    @apply text-zinc-300 m-5 focus:outline-none;
  }

  :global(.editor_styles h1) {
    @apply text-2xl;
  }

  :global(.editor_styles h2) {
    @apply text-xl;
  }

  :global(.editor_styles p) {
    @apply text-sm;
  }
</style>
