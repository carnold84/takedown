<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { Editor, EditorOptions } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import TaskList from '@tiptap/extension-task-list';
  import TaskItem from '@tiptap/extension-task-item';
  import EditorButton from './EditorButton.svelte';
  import TaskListIcon from '../icons/TaskListIcon.svelte';
  import Heading1Icon from '../icons/Heading1Icon.svelte';
  import Heading2Icon from '../icons/Heading2Icon.svelte';
  import Heading3Icon from '../icons/Heading3Icon.svelte';
  import UnorderedListIcon from '../icons/UnorderedListIcon.svelte';
  import OrderedListIcon from '../icons/OrderedListIcon.svelte';
  import ParagraphIcon from '../icons/ParagraphIcon.svelte';
  import type { EditorChangeEvent } from 'src/types';

  const dispatch = createEventDispatcher<{ change: EditorChangeEvent }>();

  let element: HTMLDivElement;
  let editor: Editor;
  export let content: Partial<Element>;
  let prevContent: Partial<Element>;

  $: {
    if (prevContent !== undefined && prevContent !== content) {
      editor.commands.setContent(content);
    }
    prevContent = content;
  }

  onMount(() => {
    const editorOptions: Partial<EditorOptions> = {
      autofocus: true,
      content,
      editorProps: {
        attributes: {
          class: 'editor_styles',
        },
      },
      element,
      extensions: [
        StarterKit,
        TaskList,
        TaskItem.configure({
          nested: true,
        }),
      ],
      onTransaction: () => {
        // force re-render so `editor.isActive` works as expected
        editor = editor;
      },
      onUpdate: ({ editor }) => {
        const json = editor.getJSON();

        dispatch('change', { json });
      },
    };
    editor = new Editor(editorOptions);
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });
</script>

<div class="w-full h-full flex flex-col">
  <div
    class="w-full flex flex-shrink-0 items-center h-14 bg-neutral-900 border-b border-neutral-600 px-5"
  >
    {#if editor}
      <EditorButton
        isActive={editor.isActive('heading', { level: 1 })}
        on:click={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1Icon />
      </EditorButton>
      <EditorButton
        isActive={editor.isActive('heading', { level: 2 })}
        on:click={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2Icon />
      </EditorButton>
      <EditorButton
        isActive={editor.isActive('heading', { level: 3 })}
        on:click={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3Icon />
      </EditorButton>
      <EditorButton
        isActive={editor.isActive('paragraph')}
        on:click={() => editor.chain().focus().setParagraph().run()}
      >
        <ParagraphIcon />
      </EditorButton>
      <EditorButton
        isActive={editor.isActive('taskList')}
        on:click={() => editor.chain().focus().toggleTaskList().run()}
      >
        <TaskListIcon />
      </EditorButton>
      <EditorButton
        isActive={editor.isActive('bulletList')}
        on:click={() => editor.commands.toggleBulletList()}
      >
        <UnorderedListIcon />
      </EditorButton>
      <EditorButton
        isActive={editor.isActive('orderedList')}
        on:click={() => editor.commands.toggleOrderedList()}
      >
        <OrderedListIcon />
      </EditorButton>
    {/if}
  </div>

  <div bind:this={element} class="w-full overflow-auto bg-neutral-900" />
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

  :global(.editor_styles ul[data-type='taskList']) {
    list-style: none;
    padding: 0;
  }

  :global(.editor_styles ul[data-type='taskList'] p) {
    @apply m-0;
  }

  :global(.editor_styles ul[data-type='taskList'] li) {
    @apply flex items-center;
  }

  :global(.editor_styles ul[data-type='taskList'] li > label) {
    @apply flex mr-3 select-none;
  }

  :global(.editor_styles ul[data-type='taskList'] li > div) {
    flex: 1 1 auto;
  }

  :global(.editor_styles > * + *) {
    @apply mt-3;
  }

  :global(.editor_styles ul) {
    @apply list-disc list-inside px-1 py-0;
  }

  :global(.editor_styles ol) {
    @apply list-decimal list-inside px-1 py-0 text-sm;
  }

  :global(.editor_styles ul p, .editor_styles ol p) {
    @apply text-sm inline;
  }
</style>
