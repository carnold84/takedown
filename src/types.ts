import type { JSONContent } from '@tiptap/core';

export interface EditorChangeEvent {
  json: JSONContent;
}

export interface State {
  isLoading: boolean;
  notes: Note[];
}
export interface Data {
  notes: Array<Note>;
}

export interface Note {
  content: object;
  id: string;
  title: string;
}
