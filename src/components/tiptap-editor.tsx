'use client'

import type { Command, RawCommands } from '@tiptap/core'
import BubbleMenuExtension from '@tiptap/extension-bubble-menu'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Highlight from '@tiptap/extension-highlight'
import ImageResize from 'tiptap-extension-resize-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import YoutubeExtension from '@tiptap/extension-youtube'
import { EditorContent, useEditor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import { common, createLowlight } from 'lowlight'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  Play,
  TableIcon,
  Underline as UnderlineIcon,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Type,
  Strikethrough,
  Code,
  Minus,
  RotateCcw,
  RotateCw,
  Eraser,
} from 'lucide-react'
import { forwardRef, useEffect, useImperativeHandle } from 'react'

import { Button } from '@/components/ui/button'

const lowlight = createLowlight(common)

interface Props {
  content: string
  onChange: (value: string) => void
}

export interface TiptapEditorRef {
  insertImage: (url: string) => void
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setImageAlign: (align: 'left' | 'center' | 'right') => ReturnType
    setImageWidth: (width: string) => ReturnType
  }
}

const CustomImage = ImageResize.extend({
  name: 'image',

  inline: true,

  group: 'inline',

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        renderHTML: (attributes) => ({
          width: attributes.width,
        }),
      },
      align: {
        default: 'center',
        renderHTML: (attributes) => ({
          'data-align': attributes.align,
        }),
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    const { align, width, ...rest } = HTMLAttributes
    const style = [`width: ${width}`, 'display: inline-block']

    if (align === 'left') {
      style.push('float: left', 'margin-right: 1.5rem', 'margin-bottom: 0.5rem')
    } else if (align === 'right') {
      style.push('float: right', 'margin-left: 1.5rem', 'margin-bottom: 0.5rem')
    } else if (align === 'center') {
      style.push('display: block', 'margin-left: auto', 'margin-right: auto', 'margin-bottom: 1rem')
    }

    return [
      'img',
      {
        ...rest,
        'data-align': align,
        style: style.join('; '),
      },
    ]
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setImageAlign:
        (align: 'left' | 'center' | 'right') =>
        ({ commands }: any) => {
          return commands.updateAttributes('image', {
            align,
          })
        },

      setImageWidth:
        (width: string) =>
        ({ commands }: any) => {
          return commands.updateAttributes('image', {
            width,
          })
        },
    } as any
  },
})

export const TiptapEditor = forwardRef<TiptapEditorRef, Props>(
  ({ content, onChange }, ref) => {
    const editor = useEditor({
      immediatelyRender: false,
      shouldRerenderOnTransaction: true,

      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
        }),

        Underline,

        Highlight,

        Link.configure({
          openOnClick: false,
        }),

        Placeholder.configure({
          placeholder: 'Comece a escrever sua matéria...',
        }),

        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),

        CustomImage.configure({
          allowBase64: true,
        }),

        YoutubeExtension.configure({
          controls: true,
        }),

        Table.configure({
          resizable: true,
        }),

        TableRow,
        TableHeader,
        TableCell,

        TaskList,

        TaskItem.configure({
          nested: true,
        }),

        CodeBlockLowlight.configure({
          lowlight,
        }),

        BubbleMenuExtension,
      ],

      content,

      editorProps: {
        attributes: {
          class:
            'prose prose-lg max-w-none min-h-[500px] p-6 border rounded-md focus:outline-none',
        },

        handlePaste(view, event) {
          const items = event.clipboardData?.items || []

          for (const item of items) {
            if (item.type.startsWith('image')) {
              const file = item.getAsFile()

              if (!file) {
                continue
              }

              const reader = new FileReader()

              reader.onload = () => {
                const src = reader.result

                if (typeof src === 'string') {
                  editor
                    ?.chain()
                    .focus()
                    .setImage({
                      src,
                    })
                    .run()
                }
              }

              reader.readAsDataURL(file)

              return true
            }
          }

          return false
        },

        handleDrop(view, event) {
          const files = event.dataTransfer?.files

          if (!files?.length) {
            return false
          }

          const file = files[0]

          if (!file.type.startsWith('image')) {
            return false
          }

          const reader = new FileReader()

          reader.onload = () => {
            const src = reader.result

            if (typeof src === 'string') {
              editor
                ?.chain()
                .focus()
                .setImage({
                  src,
                })
                .run()
            }
          }

          reader.readAsDataURL(file)

          return true
        },
      },

      onUpdate({ editor }) {
        onChange(editor.getHTML())
      },
    })

    useEffect(() => {
      if (!editor) {
        return
      }

      if (content !== editor.getHTML()) {
        editor.commands.setContent(content)
      }
    }, [content, editor])

    useImperativeHandle(ref, () => ({
      insertImage: (url: string) => {
        editor
          ?.chain()
          .focus()
          .setImage({
            src: url,
          })
          .run()
      },
    }))

    if (!editor) {
      return null
    }

    const addImage = () => {
      const url = window.prompt('URL da imagem')

      if (!url) {
        return
      }

      editor
        .chain()
        .focus()
        .setImage({
          src: url,
        })
        .run()
    }

    const setLink = () => {
      const url = window.prompt('Digite a URL')

      if (!url) {
        return
      }

      editor
        .chain()
        .focus()
        .setLink({
          href: url,
        })
        .run()
    }

    const addYoutube = () => {
      const url = window.prompt('URL do Youtube')

      if (!url) {
        return
      }

      editor
        .chain()
        .focus()
        .setYoutubeVideo({
          src: url,
        })
        .run()
    }

    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1 border rounded-md p-1 bg-white sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-1 border-r pr-1 mr-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Desfazer"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Refazer"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1 border-r pr-1 mr-1">
            <Button
              size="sm"
              variant={editor.isActive('paragraph') ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().setParagraph().run()}
              title="Texto Normal"
            >
              <Type className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              title="Título 1"
            >
              <Heading1 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              title="Título 2"
            >
              <Heading2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              title="Título 3"
            >
              <Heading3 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1 border-r pr-1 mr-1">
            <Button
              size="sm"
              variant={editor.isActive('bold') ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Negrito"
            >
              <Bold className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant={editor.isActive('italic') ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Itálico"
            >
              <Italic className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant={editor.isActive('underline') ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              title="Sublinhado"
            >
              <UnderlineIcon className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant={editor.isActive('strike') ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              title="Tachado"
            >
              <Strikethrough className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant={editor.isActive('code') ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleCode().run()}
              title="Código"
            >
              <Code className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant={editor.isActive('highlight') ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              title="Destaque"
            >
              <Highlighter className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1 border-r pr-1 mr-1">
            <Button
              size="sm"
              variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              title="Lista"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title="Lista Numerada"
            >
              <ListOrdered className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              title="Citação"
            >
              <Quote className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Linha Horizontal"
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1 border-r pr-1 mr-1">
            <Button
              size="sm"
              variant={editor.isActive('link') ? 'default' : 'ghost'}
              onClick={setLink}
              title="Link"
            >
              <LinkIcon className="w-4 h-4" />
            </Button>

            <Button size="sm" variant="ghost" onClick={addImage} title="Imagem">
              <ImageIcon className="w-4 h-4" />
            </Button>

            <Button size="sm" variant="ghost" onClick={addYoutube} title="Youtube">
              <Play className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1 border-r pr-1 mr-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => (editor.chain().focus() as any).setImageAlign('left').run()}
              title="Alinhar Imagem Esquerda"
            >
              <AlignLeft className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => (editor.chain().focus() as any).setImageAlign('center').run()}
              title="Centralizar Imagem"
            >
              <AlignCenter className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => (editor.chain().focus() as any).setImageAlign('right').run()}
              title="Alinhar Imagem Direita"
            >
              <AlignRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              title="Bloco de Código"
            >
              <Code2 className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({
                    rows: 3,
                    cols: 3,
                    withHeaderRow: true,
                  })
                  .run()
              }
              title="Tabela"
            >
              <TableIcon className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
              title="Limpar Formatação"
            >
              <Eraser className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <BubbleMenu editor={editor}>
          <div className="flex gap-1 bg-white border rounded-md p-1 shadow-lg">
            <Button
              size="sm"
              variant={editor.isActive('bold') ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant={editor.isActive('italic') ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant={editor.isActive('underline') ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant={editor.isActive('link') ? 'default' : 'ghost'}
              onClick={setLink}
            >
              <LinkIcon className="w-4 h-4" />
            </Button>
          </div>
        </BubbleMenu>

        <EditorContent editor={editor} />

        <style jsx global>{`
        .ProseMirror {
          outline: none;
        }

        .editor-image {
          max-width: 100%;
          border-radius: 12px;
        }

        .ProseMirror img[data-align='left'],
        .ProseMirror .image-resizer[data-align='left'] {
          float: left;
          margin-right: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .ProseMirror img[data-align='right'],
        .ProseMirror .image-resizer[data-align='right'] {
          float: right;
          margin-left: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .ProseMirror img[data-align='center'],
        .ProseMirror .image-resizer[data-align='center'] {
          display: block;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 1rem;
          float: none;
        }

        .ProseMirror::after {
          content: '';
          display: block;
          clear: both;
        }

        .ProseMirror .image-resizer {
          display: inline-block;
          line-height: 0;
        }

        .ProseMirror .image-resizer img {
          cursor: pointer;
        }

        .ProseMirror .image-resizer:hover {
          outline: 3px solid #3b82f6;
        }

        .ProseMirror .image-resizer.resize-active {
          outline: 3px solid #3b82f6;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        td,
        th {
          border: 1px solid #ccc;
          padding: 8px;
        }

        pre {
          background: #111;
          color: white;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
        }
      `}</style>
      </div>
    )
  },
)

TiptapEditor.displayName = 'TiptapEditor'
