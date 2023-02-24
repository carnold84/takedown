import api from '../api';
import { writable } from 'svelte/store';
import type { Note, State } from 'src/types';

const initialState: State = {
  isLoading: true,
  notes: [],
};

const notesStore = writable(initialState);

export const addNote = () => {
  const note: Note = api.addNote();

  notesStore.update((state) => {
    return {
      ...state,
      notes: [...state.notes, note],
    };
  });

  return note;
};

export const getNoteById = (notes: Note[], id: string) => {
  return notes.filter((note) => {
    return note.id === id;
  })[0];
};

const init = async () => {
  const data = await api.fetchNotes();

  console.log(data);

  notesStore.update(() => {
    return {
      isLoading: false,
      notes: data.notes,
    };
  });
};

export const removeNote = (note: Note) => {
  api.removeNote(note);

  notesStore.update((state) => {
    return {
      ...state,
      notes: state.notes.filter(({ id }) => {
        return id !== note.id;
      }),
    };
  });
};

export const updateNote = (newNote: Note) => {
  api.updateNote(newNote);

  notesStore.update((state) => {
    return {
      ...state,
      notes: state.notes.map((note) => {
        if (note.id === newNote.id) {
          return {
            ...note,
            ...newNote,
          };
        }

        return note;
      }),
    };
  });
};

init();

export default notesStore;
