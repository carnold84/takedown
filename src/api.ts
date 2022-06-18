export interface Data {
  notes: Array<Note>;
}

export interface Note {
  content: object;
  id: string;
  title: string;
}

// load data
const response = localStorage.getItem('takedown');
let data: Data;

const setState = (state: Data) => {
  localStorage.setItem('takedown', JSON.stringify(state));
};

if (response === null) {
  const defaultData = { notes: [] };
  setState(defaultData);
  data = defaultData;
} else {
  data = JSON.parse(response);
}

const api = {
  addNote() {
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

    const nextNotes = [...this.data.notes, note];

    this.setNotes(nextNotes);

    return note;
  },
  data,
  getNotes() {
    return data.notes;
  },
  removeNote({ id }: Note) {
    const nextNotes: Array<Note> = this.data.notes.filter((note: Note) => {
      return note.id !== id;
    });

    this.setNotes(nextNotes);
  },
  setNotes(notes: Array<Note>) {
    this.data = { ...this.data, notes };
    setState(this.data);
  },
  updateNote({ content, id, title }: Note) {
    const nextNotes: Array<Note> = this.data.notes.map((note: Note) => {
      if (note.id === id) {
        return {
          ...note,
          content,
          title,
        };
      }

      return note;
    });

    this.setNotes(nextNotes);
  },
};

export default api;
