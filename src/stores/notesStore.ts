import api, { Note } from '../api';
import { writable } from 'svelte/store';

const initialState: Array<Note> = api.getNotes();

const notesStore = writable(initialState);

export const addNote = () => {
  const note = api.addNote();

  notesStore.update((value) => {
    const nextNotesStore = [...value, note];

    return nextNotesStore;
  });
};

export const getNoteById = (notes: Array<Note>, id: string) => {
  return notes.filter((note) => {
    return note.id === id;
  })[0];
};

export const removeNote = (note: Note) => {
  api.removeNote(note);

  notesStore.update((value: Array<Note>) => {
    const nextNotesStore = value.filter(({ id }) => {
      return id !== note.id;
    });

    return nextNotesStore;
  });
};

export const updateNote = (note: Note) => {
  api.updateNote(note);
};

export default notesStore;
