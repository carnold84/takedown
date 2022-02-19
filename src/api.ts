export interface Data {
  notes: Array<Note>;
}

export interface Note {
  content: string;
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

export default {
  addNote() {
    const note = {
      id: `id-${new Date().getTime()}`,
      content: '',
      title: 'New Note',
    };

    const nextNotes = [...this.data.notes, note];

    this.setNotes(nextNotes);

    return note;
  },
  data,
  getNotes() {
    return data.notes;
  },
  setNotes(notes) {
    setState({ ...this.data, notes });
  },
};
