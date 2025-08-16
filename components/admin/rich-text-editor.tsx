"use client"

import { useEffect, useRef } from "react"
import type QuillType from "quill"
import "quill/dist/quill.snow.css"

type RichTextEditorProps = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextEditor({ value, onChange, placeholder, className = "" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const quillRef = useRef<QuillType | null>(null)

  useEffect(() => {
    let mounted = true

    async function init() {
      const { default: Quill } = await import("quill")
      if (!mounted || !editorRef.current) return

      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["link", "blockquote", "code-block", "clean"],
          ],
        },
      })

      if (value) {
        quillRef.current.root.innerHTML = value
      }

      const handler = () => {
        if (!quillRef.current) return
        onChange(quillRef.current.root.innerHTML)
      }
      quillRef.current.on("text-change", handler)
    }

    init().catch(console.error)

    return () => {
      mounted = false
      quillRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (quillRef.current) {
      const current = quillRef.current.root.innerHTML
      if (current !== value) {
        quillRef.current.root.innerHTML = value || ""
      }
    }
  }, [value])

  return (
    <div className={className}>
      <div ref={editorRef} className="min-h-[220px]" />
    </div>
  )
}
