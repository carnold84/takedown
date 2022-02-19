<script lang="ts">
  import Editor from './components/Editor.svelte';
  import notesStore, { addNote, getNoteById } from './stores/notes';

  let notes = [];
  let selectedNote = undefined;

  // subscribe to get notes when they are updated
  notesStore.subscribe((value) => {
    notes = value;
    selectedNote = !selectedNote ? value[0] : selectedNote;
  });

  const onSelectNote = (id) => {
    selectedNote = getNoteById(notes, id);
  };

  const onAddNote = () => {
    addNote();
  };

  const onEditorChange = (evt) => {
    console.log(evt.detail.json);
  };
</script>

<main class="grid grid-cols-12 min-h-screen w-full bg-neutral-900">
  <div
    class="col-span-5 md:col-span-4 lg:col-span-3 flex flex-col bg-neutral-800"
  >
    <div class="flex items-center h-14 border-b border-neutral-500 px-5">
      <h1 class="flex-grow text-xl text-zinc-400">Notes</h1>
      <button
        class="text-md text-zinc-500 hover:text-zinc-300"
        title="New note"
        on:click={onAddNote}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 12H12M16 12H12M12 12V8M12 12V16"
            stroke="currentcolor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentcolor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
    <div class="grow p-5">
      {#if notes.length === 0}
        <p class="text-sm text-center text-zinc-400">No Notes</p>
      {:else}
        <ul class="list-none">
          {#each notes as note}
            <li
              class="text-sm text-zinc-400 hover:text-zinc-200 rounded-md cursor-pointer mb-2 px-5 py-3 {note.id ===
              selectedNote.id
                ? 'text-zinc-200 bg-neutral-700'
                : ''}"
              on:click={() => onSelectNote(note.id)}
            >
              {note.title}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
  <div
    class="h-full col-span-7 md:col-span-8 lg:col-span-9 bg-neutral-900 text-zinc-200"
  >
    {#if selectedNote}
      <Editor content={selectedNote.content} on:change={onEditorChange} />
    {/if}
  </div>
</main>
