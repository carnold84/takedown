<script lang="ts">
  import Editor from './components/Editor.svelte';
  import AddIcon from './icons/AddIcon.svelte';
  import CompleteIcon from './icons/CompleteIcon.svelte';
  import RemoveIcon from './icons/RemoveIcon.svelte';
  import SavingIcon from './icons/SavingIcon.svelte';
  import notesStore, {
    addNote,
    removeNote,
    updateNote,
  } from './stores/notesStore';

  let editedNote;
  let notes = [];
  let saving = false;
  let timeoutId = null;
  let title;

  const onSelectNote = (note) => {
    if (note) {
      editedNote = { ...note };
      title = editedNote.title;
    }
  };

  const onAddNote = () => {
    addNote();
  };

  const onRemoveNote = (note) => {
    removeNote(note);
  };

  const debouncedUpdateNote = (data) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      updateNote({
        ...editedNote,
        ...data,
      });
      saving = false;
    }, 2000);
  };

  const onChange = (evt) => {
    saving = true;
    let update;

    if (evt.detail) {
      update = {
        content: evt.detail.json,
      };
    } else {
      update = {
        title: evt.target.value,
      };
      title = update.title;
    }

    debouncedUpdateNote(update);
  };

  // subscribe to get notes when they are updated
  notesStore.subscribe((value) => {
    notes = value;

    if (!editedNote) {
      onSelectNote(notes[0]);
    }
  });
</script>

<main class="absolute flex h-full w-full overflow-hidden bg-neutral-900">
  <div class="w-5/12 lg:w-4/12 xl:w-3/12 h-full flex flex-col bg-neutral-800">
    <div
      class="flex flex-shrink-0 items-center h-14 border-b border-neutral-500 px-5"
    >
      <h1 class="flex-grow text-xl text-zinc-400">Notes</h1>
      <button
        class="text-md text-zinc-500 hover:text-zinc-300"
        title="New note"
        on:click={onAddNote}
      >
        <AddIcon />
      </button>
    </div>
    <div class="overflow-auto p-5">
      {#if notes.length === 0}
        <p class="text-sm text-center text-zinc-400">No Notes</p>
      {:else}
        <ul class="list-none">
          {#each notes as note}
            <li
              class="flex items-center h-12 text-sm text-zinc-400 hover:text-zinc-200 rounded-md cursor-pointer mb-2 pl-5 pr-2 {note.id ===
              editedNote.id
                ? 'text-zinc-200 bg-neutral-600'
                : ''}"
              on:click={() => onSelectNote(note)}
            >
              <div class="grow text-ellipsis overflow-hidden whitespace-nowrap">
                {editedNote.id === note.id ? title : note.title}
              </div>
              <div>
                <button
                  class="flex items-center justify-center h-10 w-10 text-zinc-500 hover:text-zinc-300 ml-2"
                  on:click={() => onRemoveNote(note)}
                >
                  <RemoveIcon />
                </button>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
  <div
    class="h-full flex flex-col w-7/12 lg:w-8/12 xl:w-9/12 bg-neutral-900 text-zinc-200"
  >
    {#if editedNote}
      <div class="w-full flex items-center px-5 py-4">
        <input
          class="grow text-xl bg-transparent outline-0"
          value={title}
          on:input={onChange}
        />
        <div class=" text-zinc-500">
          {#if saving}
            <SavingIcon />
          {:else}
            <CompleteIcon />
          {/if}
        </div>
      </div>
      <div class="relative grow overflow-hidden">
        <Editor content={editedNote.content} on:change={onChange} />
      </div>
    {/if}
  </div>
</main>
