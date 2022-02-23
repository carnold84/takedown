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

const setState = (state) => {
  localStorage.setItem('takedown', JSON.stringify(state));
};

if (response === null) {
  const defaultData = { notes: [] };
  setState(defaultData);
  data = defaultData;
} else {
  data = JSON.parse(response);
}

console.log(JSON.stringify(data.notes[0]));

export default {
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
  updateNote({ content, id, title }) {
    const nextNotes: Array<Note> = this.data.notes.map((note) => {
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
  setNotes(notes) {
    this.data = { ...this.data, notes };
    setState(this.data);
  },
};
