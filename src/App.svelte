<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
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
  import type { EditorChangeEvent, Note } from './types';

  let selectedNote: Note | null = null;
  let isMenuVisible: boolean = false;
  let isSaveRequired: boolean = false;
  let isSaving: boolean = false;
  let notes: Note[] = [];
  let timeoutId: NodeJS.Timeout = null;

  const onToggleMenu = () => {
    isMenuVisible = !isMenuVisible;
  };

  const selectNote = (note: Note) => {
    selectedNote = note ?? null;
    isMenuVisible = false;
  };

  const onAddNote = () => {
    const note: Note = addNote();

    selectNote(note);
    isMenuVisible = false;
  };

  const onRemoveNote = (note: Note) => {
    removeNote(note);

    if (note.id === selectedNote.id) {
      selectNote(undefined);
    }
  };

  const debouncedUpdateNote = (data: Partial<Note>) => {
    isSaveRequired = true;
    clearTimeout(timeoutId);

    const updatedNote = {
      ...selectedNote,
      ...data,
    };

    timeoutId = setTimeout(() => {
      isSaving = true;

      updateNote(updatedNote);
      setTimeout(() => {
        isSaving = false;
        isSaveRequired = false;
      }, 500);
    }, 2000);
  };

  const onEditorChange = (evt: CustomEvent<EditorChangeEvent>) => {
    debouncedUpdateNote({
      content: evt.detail.json,
    });
  };

  const onTitleChange = (evt: Event) => {
    debouncedUpdateNote({
      title: (evt.target as HTMLInputElement).value,
    });
  };

  const onWindowClose = (evt: BeforeUnloadEvent) => {
    if (isSaveRequired) {
      evt.preventDefault();
      evt.returnValue = '';
      confirm('You have unsaved notes. Are you sure you want to leave?');
    }
  };

  onMount(() => {
    console.log('MOUNT');
    window.addEventListener('beforeunload', onWindowClose);
  });

  onDestroy(() => {
    window.removeEventListener('beforeunload', onWindowClose);
  });

  // subscribe to get notes when they are updated
  notesStore.subscribe((state) => {
    notes = state.notes;

    if (!selectedNote) {
      selectNote(notes[0]);
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
  </div>
  <div class="flex flex-grow w-full overflow-hidden bg-neutral-900">
    <button
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
      <div
        class="h-14 flex items-center justify-between bg-neutral-800 border-b border-neutral-500 px-4"
      >
        <h2 class="text-zinc-400">Notes</h2>
        <button
          class="text-md text-zinc-500 hover:text-zinc-300"
          title="New note"
          on:click={onAddNote}
        >
          <AddIcon />
        </button>
      </div>
      <div class="overflow-auto p-4">
        {#if notes.length === 0}
          <p class="text-sm text-center text-zinc-400 my-3">No Notes</p>
        {:else}
          <ul class="list-none">
            {#each notes as note}
              <li
                class="flex items-center h-12 text-sm text-zinc-400 hover:text-zinc-200 rounded-md cursor-pointer mb-2 {note.id ===
                selectedNote?.id
                  ? 'text-zinc-200 bg-neutral-600'
                  : ''}"
              >
                <button
                  class="h-full flex items-center grow text-ellipsis overflow-hidden whitespace-nowrap pl-5"
                  on:click={() => selectNote(note)}
                >
                  {note.title}
                </button>
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
      {#if selectedNote}
        <div
          class="flex flex-shrink-0 items-center h-14 border-b border-neutral-600 px-5"
        >
          <input
            class="grow text-xl bg-transparent outline-0 focus:outline-none"
            value={selectedNote.title}
            on:input={onTitleChange}
          />
          <div>
            {#if isSaving}
              <span class="text-zinc-200">
                <SavingIcon />
              </span>
            {:else}
              <span class="text-zinc-500">
                <CompleteIcon />
              </span>
            {/if}
          </div>
        </div>
        <div class="relative grow overflow-hidden">
          <Editor content={selectedNote.content} on:change={onEditorChange} />
        </div>
      {/if}
    </div>
  </div>
</main>
