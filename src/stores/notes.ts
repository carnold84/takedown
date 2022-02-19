import api, { Note } from '../api';
import { writable } from 'svelte/store';

const defaultNotes: Array<Note> = [
  {
    content: 'Kia ora World!',
    id: '1',
    title: 'Note number 1',
  },
  {
    content: 'Aloha World!',
    id: '2',
    title: 'Note number 2',
  },
];

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

export default notesStore;
