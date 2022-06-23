<script lang="ts">
  import Editor from './components/Editor.svelte';
  import AddIcon from './icons/AddIcon.svelte';
  import CompleteIcon from './icons/CompleteIcon.svelte';
  import MenuIcon from './icons/MenuIcon.svelte';
  import RemoveIcon from './icons/RemoveIcon.svelte';
  import SavingIcon from './icons/SavingIcon.svelte';
  import notesStore, {
    addNote,
    removeNote,
    updateNote,
  } from './stores/notesStore';

  let editedNote = null;
  let isMenuVisible = false;
  let isSaving = false;
  let notes = [];
  let timeoutId = null;
  let title;

  const onToggleMenu = () => {
    isMenuVisible = !isMenuVisible;
  };

  const onSelectNote = (note) => {
    if (note) {
      editedNote = { ...note };
      title = editedNote.title;
    } else {
      editedNote = null;
    }

    isMenuVisible = false;
  };

  const onAddNote = () => {
    const note = addNote();

    onSelectNote(note);
    isMenuVisible = false;
  };

  const onRemoveNote = (note) => {
    removeNote(note);

    if (note.id === editedNote.id) {
      console.log('CLEAR');
      onSelectNote(undefined);
    }
  };

  const debouncedUpdateNote = (data) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      isSaving = true;

      updateNote({
        ...editedNote,
        ...data,
      });
      setTimeout(() => {
        isSaving = false;
      }, 500);
    }, 2000);
  };

  const onChange = (evt) => {
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

<main
  class="absolute flex flex-col h-full w-full overflow-hidden bg-neutral-900"
>
  <div
    class="flex flex-shrink-0 items-center justify-between h-14 bg-neutral-700 px-5"
  >
    <div class="flex">
      <button
        class="block lg:hidden text-md text-zinc-500 hover:text-zinc-300 mr-5"
        title="Menu"
        on:click={onToggleMenu}
      >
        <MenuIcon />
      </button>
      <h1 class="flex-grow font-sans text-lg text-zinc-400">Takedown</h1>
    </div>
    <button
      class="text-md text-zinc-500 hover:text-zinc-300"
      title="New note"
      on:click={onAddNote}
    >
      <AddIcon />
    </button>
  </div>
  <div class="flex flex-grow w-full overflow-hidden bg-neutral-900">
    <div
      class="absolute h-full w-full left-0 top-0 block lg:hidden bg-black/25 z-10"
      class:block={isMenuVisible === true}
      class:hidden={isMenuVisible === false}
      on:click={onToggleMenu}
    />
    <div
      class="fixed w-80 h-full top-0 left-0 lg:relative lg:flex flex-col bg-neutral-800 z-20"
      class:flex={isMenuVisible === true}
      class:hidden={isMenuVisible === false}
    >
      <div class="overflow-auto p-5">
        {#if notes.length === 0}
          <p class="text-sm text-center text-zinc-400 my-3">No Notes</p>
        {:else}
          <ul class="list-none">
            {#each notes as note}
              <li
                class="flex items-center h-12 text-sm text-zinc-400 hover:text-zinc-200 rounded-md cursor-pointer mb-2 {note.id ===
                editedNote?.id
                  ? 'text-zinc-200 bg-neutral-600'
                  : ''}"
              >
                <div
                  class="h-full flex items-center grow text-ellipsis overflow-hidden whitespace-nowrap pl-5"
                  on:click={() => onSelectNote(note)}
                >
                  {editedNote?.id === note.id ? title : note.title}
                </div>
                <div class="px-2">
                  <button
                    class="flex items-center justify-center h-10 w-10 text-zinc-500 hover:text-zinc-300"
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
      class="h-full flex flex-col flex-grow lg:w-8/12 xl:w-9/12 bg-neutral-900 text-zinc-200 z-0"
    >
      {#if editedNote}
        <div
          class="flex flex-shrink-0 items-center h-14 border-b border-neutral-600 px-5"
        >
          <input
            class="grow text-xl bg-transparent outline-0 focus:outline-none"
            value={title}
            on:input={onChange}
          />
          <div class="text-zinc-500">
            {#if isSaving}
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
  </div>
</main>
