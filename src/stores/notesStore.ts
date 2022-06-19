import api, { Note } from '../api';
import { writable } from 'svelte/store';

const initialState: Array<Note> = api.getNotes();

const notesStore = writable(initialState);

export const addNote = () => {
  const note = api.addNote();

  notesStore.update((value) => {
    return [...value, note];
  });

  return note;
};

export const getNoteById = (notes, id) => {
  return notes.filter((note) => {
    return note.id === id;
  })[0];
};

export const removeNote = (note) => {
  api.removeNote(note);

  notesStore.update((value) => {
    return value.filter(({ id }) => {
      return id !== note.id;
    });
  });
};

export const updateNote = (newNote) => {
  api.updateNote(newNote);

  notesStore.update((value) => {
    return value.map((note) => {
      if (note.id === newNote.id) {
        return {
          ...note,
          ...newNote,
        };
      }

      return note;
    });
  });
};

export default notesStore;
