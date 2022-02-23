<script lang="ts">
  import Editor from './components/Editor.svelte';
  import notesStore, { addNote, getNoteById, updateNote } from './stores/notes';

  let editedNote;
  let notes = [];
  let saving = false;
  let timeoutId = null;

  const onSelectNote = (id) => {
    if (id) {
      editedNote = { ...getNoteById(notes, id) };
    }
  };

  const onAddNote = () => {
    addNote();
  };

  const debouncedUpdateNote = (note) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      updateNote(note);
      saving = false;
    }, 2000);
  };

  const onChange = (evt) => {
    saving = true;

    if (evt.detail) {
      editedNote = {
        ...editedNote,
        content: evt.detail.json,
      };
    } else {
      editedNote = {
        ...editedNote,
        title: evt.target.value,
      };
    }

    debouncedUpdateNote(editedNote);
  };

  // subscribe to get notes when they are updated
  notesStore.subscribe((value) => {
    notes = value;

    if (!editedNote) {
      onSelectNote(value[0].id);
    }
  });
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
              editedNote.id
                ? 'text-zinc-200 bg-neutral-600'
                : ''}"
              on:click={() => onSelectNote(note.id)}
            >
              {editedNote.id === note.id ? editedNote.title : note.title}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
  <div
    class="w-full h-full flex flex-col col-span-7 md:col-span-8 lg:col-span-9 bg-neutral-900 text-zinc-200"
  >
    {#if editedNote}
      <div class="w-full flex items-center px-5 py-4">
        <input
          class="grow text-xl bg-transparent outline-0"
          value={editedNote.title}
          on:input={onChange}
        />
        <div>
          {#if saving}
            <svg
              class="animate-spin text-zinc-500"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.1679 8C19.6248 4.46819 16.1006 2 12 2C6.81465 2 2.5511 5.94668 2.04938 11"
                stroke="currentcolor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3"
                stroke="currentcolor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.88146 16C4.42458 19.5318 7.94874 22 12.0494 22C17.2347 22 21.4983 18.0533 22 13"
                stroke="currentcolor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.04932 16H2.64932C2.31795 16 2.04932 16.2686 2.04932 16.6V21"
                stroke="currentcolor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          {:else}
            <svg
              class="text-zinc-600"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 13L9 17L19 7"
                stroke="currentcolor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          {/if}
        </div>
      </div>
      <Editor content={editedNote.content} on:change={onChange} />
    {/if}
  </div>
</main>
