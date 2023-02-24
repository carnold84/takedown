import localforage from 'localforage';
import type { Data, Note } from './types';

const store = localforage.createInstance({
  name: 'takedown',
});
let data: Data;

const addNote = () => {
  const note: Note = {
    content: {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'New note' }] },
      ],
    },
    id: `id-${new Date().getTime()}`,
    title: 'New note',
  };

  const nextNotes = [...data.notes, note];

  saveNotes(nextNotes);

  return note;
};

const fetchNotes = async () => {
  try {
    const notes: Note[] = await store.getItem('notes');

    if (notes === null) {
      const defaultData: Data = { notes: [] };
      data = defaultData;
    } else {
      data = { notes };
    }

    return data;
  } catch (err) {
    console.log(err);
  }
};

const removeNote = ({ id }: Note) => {
  const nextNotes: Array<Note> = data.notes.filter((note: Note) => {
    return note.id !== id;
  });

  saveNotes(nextNotes);
};

const saveNotes = (notes: Note[]) => {
  store.setItem('notes', notes);
};

const updateNote = ({ content, id, title }: Note) => {
  const nextNotes: Array<Note> = data.notes.map((note: Note) => {
    if (note.id === id) {
      return {
        ...note,
        content,
        title,
      };
    }

    return note;
  });

  saveNotes(nextNotes);
};

const api = {
  addNote,
  fetchNotes,
  removeNote,
  updateNote,
};

export default api;
