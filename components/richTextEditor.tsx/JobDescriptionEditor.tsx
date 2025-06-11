import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import MenuBar from './MenuBar'
import { ControllerRenderProps } from 'react-hook-form'
import { jobSchema } from '@/app/utils/zodSchemas'
import { useEffect } from 'react'

import { TypeOf } from 'zod'

interface iAppProps {
  // field: ControllerRenderProps<TypeOf<typeof jobSchema>, 'jobDescription'>
  field: ControllerRenderProps
}

export function JobDescriptionEditor({ field }: iAppProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Typography,
    ],
    // We are rendering it in client side so false, tiptap doesn't work on server side
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'min-h-[300px] p-4 max-w-none focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert',
      },
    },
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()))
    },

    content: field.value ? JSON.parse(field.value) : 'Hello',
  })

  // useEffect(() => {
  //   if (editor) {
  //     console.log('Editor State:', {
  //       isEditable: editor.isEditable,
  //       isActive: {
  //         heading1: editor.isActive('heading', { level: 1 }),
  //         heading2: editor.isActive('heading', { level: 2 }),
  //         heading3: editor.isActive('heading', { level: 3 }),
  //         bulletList: editor.isActive('bulletList'),
  //         orderedList: editor.isActive('orderedList'),
  //       },
  //     })
  //   }
  // }, [editor])

  return (
    <div className="w-full border rounded-lg overflow-hidden bg-card">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default JobDescriptionEditor
