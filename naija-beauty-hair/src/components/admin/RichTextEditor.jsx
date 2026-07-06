import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { useRef, useEffect } from 'react'

const btn = (active) =>
  `px-2.5 py-1.5 text-xs font-medium rounded transition-colors ${
    active ? 'bg-ink text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }`

export default function RichTextEditor({ value, onChange, minHeight = '300px' }) {
  const updatingRef = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Image,
      Link.configure({ openOnClick: false }),
    ],
    content: value || '',
    onUpdate: ({ editor: ed }) => {
      if (!updatingRef.current) onChange(ed.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    const html = editor.getHTML()
    if (value !== html) {
      updatingRef.current = true
      editor.commands.setContent(value || '', false)
      updatingRef.current = false
    }
  }, [editor, value])

  if (!editor) return null

  return (
    <div className="border border-gray-300 rounded overflow-hidden bg-white" style={{ minHeight }}>
      <div className="flex flex-wrap gap-0.5 p-1.5 border-b border-gray-200 bg-gray-50/80">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))} title="Bold"><strong>B</strong></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))} title="Italic"><em>I</em></button>
        <span className="w-px bg-gray-200 mx-0.5" />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive('heading', { level: 2 }))} title="Heading 2">H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive('heading', { level: 3 }))} title="Heading 3">H3</button>
        <span className="w-px bg-gray-200 mx-0.5" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))} title="Bullet List">≡ List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))} title="Ordered List"># List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive('blockquote'))} title="Quote">" Quote</button>
        <span className="w-px bg-gray-200 mx-0.5" />
        <button
          type="button"
          onClick={() => {
            const url = prompt('Link URL:')
            if (url) editor.chain().focus().setLink({ href: url }).run()
          }}
          className={btn(editor.isActive('link'))}
          title="Insert Link"
        >
          🔗 Link
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt('Image URL:')
            if (url) editor.chain().focus().setImage({ src: url }).run()
          }}
          className="px-2.5 py-1.5 text-xs font-medium rounded text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          title="Insert Image"
        >
          🖼 Img
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm prose-headings:font-serif prose-headings:text-gray-900 max-w-none p-4 min-h-[160px] focus:outline-none [&_.ProseMirror]:outline-none"
      />
    </div>
  )
}
