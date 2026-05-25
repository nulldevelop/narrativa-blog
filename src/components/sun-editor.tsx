'use client'

import dynamic from 'next/dynamic'
import 'suneditor/dist/css/suneditor.min.css'
import { forwardRef, useImperativeHandle, useRef } from 'react'

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
})

interface Props {
  content: string
  onChange: (value: string) => void
}

export interface SunEditorRef {
  insertImage: (url: string) => void
}

export const MyEditor = forwardRef<SunEditorRef, Props>(
  ({ content, onChange }, ref) => {
    const editorRef = useRef<any>(null)

    useImperativeHandle(ref, () => ({
      insertImage: (url: string) => {
        if (editorRef.current) {
          editorRef.current.insertImage(url)
        }
      },
    }))

    return (
      <div className="sun-editor-container">
        <SunEditor
          getSunEditorInstance={(sunEditor) => {
            editorRef.current = sunEditor
          }}
          setContents={content}
          onChange={onChange}
          setOptions={{
            buttonList: [
              ['undo', 'redo'],
              ['font', 'fontSize', 'formatBlock'],
              ['paragraphStyle', 'blockquote'],
              ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
              ['fontColor', 'hiliteColor', 'textStyle'],
              ['removeFormat'],
              ['outdent', 'indent'],
              ['align', 'horizontalRule', 'list', 'lineHeight'],
              ['table', 'link', 'image', 'video'],
              ['fullScreen', 'showBlocks', 'codeView'],
              ['preview', 'print'],
            ],
            defaultStyle: 'font-family: Arial; font-size: 16px;',
            width: '100%',
            height: 'auto',
            minHeight: '500px',
          }}
        />
        <style jsx global>{`
          .sun-editor-container .sun-editor {
            border-color: #e2e8f0;
            border-radius: 0.375rem;
          }
          .sun-editor-container .sun-editor .se-toolbar {
            outline: none;
            background-color: #fff;
            border-top-left-radius: 0.375rem;
            border-top-right-radius: 0.375rem;
            border-bottom: 1px solid #e2e8f0;
          }
          .sun-editor-container .sun-editor .se-resizing-bar {
             display: none;
          }
          .sun-editor-container .sun-editor .se-wrapper .se-wrapper-inner {
            min-height: 500px;
          }
        `}</style>
      </div>
    )
  },
)

MyEditor.displayName = 'MyEditor'
