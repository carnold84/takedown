import { generateText } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

const generateTitle = (content: object) => {
  return generateText(content, [StarterKit]);
};

export default generateTitle;
