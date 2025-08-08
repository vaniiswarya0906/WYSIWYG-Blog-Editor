import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function Home() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const quillRef = useRef(null);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'align', 'list', 'bullet', 'blockquote', 'code-block', 'link', 'image'
  ];

  // Add hover tooltips for toolbar buttons
  useEffect(() => {
    const timer = setTimeout(() => {
      const toolbar = document.querySelector('.ql-toolbar');
      if (toolbar) {
        const tooltips = {
          'ql-bold': 'Bold',
          'ql-italic': 'Italic',
          'ql-underline': 'Underline',
          'ql-strike': 'Strikethrough',
          'ql-header': 'Heading',
          'ql-list[value="ordered"]': 'Numbered List',
          'ql-list[value="bullet"]': 'Bullet List',
          'ql-blockquote': 'Blockquote',
          'ql-code-block': 'Code Block',
          'ql-link': 'Insert Link',
          'ql-image': 'Insert Image',
          'ql-align': 'Text Alignment',
          'ql-clean': 'Clear Formatting'
        };

        Object.keys(tooltips).forEach(selector => {
          const button =
            toolbar.querySelector(`.${selector}`) ||
            toolbar.querySelector(`[class*="${selector}"]`);
          if (button) {
            button.setAttribute('title', tooltips[selector]);
          }
        });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Fake Save / Publish
  const handleSave = (status) => {
    if (!title.trim() || !content.trim()) {
      setMessage('Title and content are required.');
      return;
    }
    setMessage(status === 'published' ? '✅ Post published!' : '💾 Draft saved!');
  };

  return (
    <div className={`${styles.pageWrapper} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h1 className={styles.heading}>WYSIWYG Blog Editor</h1>
          <button
            className={styles.toggleButton}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <input
          className={styles.input}
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className={styles.input}
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        {!preview ? (
          <ReactQuill
            ref={quillRef}
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            className={`${styles.editor} ${darkMode ? styles.darkEditor : ''}`}
            placeholder="Write your blog content here..."
          />
        ) : (
          <div
            className={styles.preview}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        <div className={styles.buttonRow}>
          <button onClick={() => setPreview(!preview)}>
            {preview ? 'Edit Mode' : 'Preview Mode'}
          </button>
          <button onClick={() => handleSave('draft')}>Save</button>
          <button onClick={() => handleSave('published')}>Publish</button>
        </div>

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}
