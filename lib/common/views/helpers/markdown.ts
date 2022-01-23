import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export const processMarkdown = (markdown='') => {
  const html = marked.parse(markdown);
  const sanitizedHtml = sanitizeHtml(html);
  return sanitizedHtml;
}