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

export const getNoteById = (notes, id) => {
  return notes.filter((note) => {
    return note.id === id;
  })[0];
};

export const updateNote = (note) => {
  api.updateNote(note);
};

export default notesStore;
