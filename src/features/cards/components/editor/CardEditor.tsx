"use client"

import { Editor, useMonaco } from "@monaco-editor/react"
import { useState, useRef } from "react"
import { LinkIcon, Download, X } from "lucide-react"

import { Button } from "@/shared/ui/button"
import { Card, CardContent as CardContainer, CardFooter, CardHeader } from "@/shared/ui/card"

import { EditorPreview } from "./EditorPreview"
import { EditorToolbar } from "./EditorToolbar"
import type { CardStyle, EditorSettings, ToolbarItem } from "../../types/card.types"
import { useCardEditor } from "@/features/cards/hooks/useCardEditor"
import { useCardQr } from "@/features/cards/hooks/useCardQr"

interface CardEditorProps {
  cardId: string
}

export function CardEditor({ cardId }: CardEditorProps) {
  const {
    content,
    style,
    setContent: setHookContent,
    setStyle: setHookStyle,
    saveCard,
    isLoading: isLoadingCardData,
    isSaving,
    isDirty,
    isFetchError,
    vcardData,
    setVCardData,
  } = useCardEditor({ cardId })

  const {
    qrCodeDataUrl,
    showQrModal,
    isGeneratingQr,
    downloadQrCode,
    openQrModal,
    closeQrModal,
  } = useCardQr({ cardId })

  const [settings, setSettings] = useState<EditorSettings>({
    autoSave: false,
    showPreview: true,
    previewPosition: "side",
    darkMode: false
  })

  const [selection, setSelection] = useState<string>("")
  
  const editorRef = useRef<any>(null)
  const monaco = useMonaco()

  const handleMonacoEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setHookContent(value)
    }
  }

  const handleToolbarStyleChange = (newStyle: Partial<CardStyle>) => {
    setHookStyle(newStyle)
  }

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
    
    editor.onDidChangeCursorSelection((e: any) => {
      if (e.selection.isEmpty()) {
        setSelection("")
        return
      }
      
      const model = editor.getModel()
      if (model) {
        const selectedText = model.getValueInRange(e.selection)
        setSelection(selectedText)
      }
    })
  }
  
  const handleFormat = (type: ToolbarItem, formattedText: string) => {
    if (!editorRef.current) return
    
    const editor = editorRef.current
    const currentSelection = editor.getSelection()
    
    if (currentSelection && !currentSelection.isEmpty()) {
      const model = editor.getModel()
      if (model) {
        editor.executeEdits("markdown-format", [{ range: currentSelection, text: formattedText, forceMoveMarkers: true }])
      }
    } else {
      const position = editor.getPosition()
      if (position) {
        editor.executeEdits("markdown-format", [{
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          },
          text: formattedText,
          forceMoveMarkers: true
        }])
      }
    }
  }

  if (isFetchError) {
    return (
      <Card className="min-h-[400px] w-full">
        <CardContainer className="flex h-full items-center justify-center">
          <p className="text-red-500">Произошла ошибка при загрузке содержимого карточки.</p>
        </CardContainer>
      </Card>
    )
  }

  if (isLoadingCardData) {
    return (
      <Card className="min-h-[400px] w-full">
        <CardContainer className="flex h-full items-center justify-center">
          <p>Загрузка редактора...</p>
        </CardContainer>
      </Card>
    )
  }

  return (
    <Card className="min-h-[600px] w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <EditorToolbar 
            onStyleChange={handleToolbarStyleChange} 
            style={style} 
            settings={settings}
            onSettingsChange={setSettings}
            onFormat={handleFormat}
            selection={selection}
            vcardData={vcardData}
            onVCardChange={setVCardData}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={openQrModal}
            disabled={isGeneratingQr}
            className="ml-2"
          >
            {isGeneratingQr ? (
                <span className="animate-pulse">Генерация...</span>
            ) : (
                <LinkIcon className="mr-1 h-4 w-4" />
            )}
            QR-код
          </Button>
        </div>
      </CardHeader>
      
      <CardContainer className="grid min-h-[500px] gap-4 p-0">
        <div 
          className={`grid gap-4 h-full ${
            settings.showPreview 
              ? (settings.previewPosition === 'side' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 grid-rows-2') 
              : 'grid-cols-1'
          }`}
        >
          <div className={`relative p-4 ${settings.showPreview && settings.previewPosition === 'bottom' ? 'row-span-1 h-full min-h-[250px]' : 'h-full min-h-[400px]'}`}>
            <Editor
              height="100%"
              defaultLanguage="markdown"
              value={content}
              onChange={handleMonacoEditorChange}
              onMount={handleEditorDidMount}
              theme={settings.darkMode ? "vs-dark" : "light"}
              options={{
                minimap: { enabled: false },
                lineNumbers: "on",
                wordWrap: "on",
                automaticLayout: true
              }}
            />
          </div>
          
          {settings.showPreview && (
            <div className={`relative overflow-auto p-4 ${settings.previewPosition === 'bottom' ? 'row-span-1 h-full min-h-[250px]' : 'min-h-[400px]'}`}>
              <EditorPreview content={content} style={style} />
            </div>
          )}
        </div>
      </CardContainer>
      
      <CardFooter className="flex justify-end space-x-2">
        {isDirty && (
          <span className="text-sm text-muted-foreground">Несохраненные изменения</span>
        )}
        <Button
          onClick={saveCard}
          disabled={isSaving || !isDirty}
        >
          {isSaving ? "Сохранение..." : "Сохранить"}
        </Button>
      </CardFooter>

      {showQrModal && qrCodeDataUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">QR-код для карточки</h3>
              <Button variant="ghost" size="sm" onClick={closeQrModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mb-4 flex justify-center">
              <img src={qrCodeDataUrl} alt="QR-код" className="h-64 w-64" />
            </div>
            <p className="mb-4 text-sm text-gray-500">
              Отсканируйте этот QR-код для просмотра содержимого карточки
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={closeQrModal}>
                Закрыть
              </Button>
              <Button onClick={downloadQrCode} disabled={isGeneratingQr}>
                {isGeneratingQr ? "..." : <Download className="mr-1 h-4 w-4" />}
                Скачать
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
} 