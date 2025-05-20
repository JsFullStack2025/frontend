"use client"

import { useState } from "react"
import { Bold, Italic, Heading, Quote, Code, Link, Image, List, ListOrdered, ListTodo, Eye, EyeOff, SunMoon, Moon, Sun, Layout, LayoutList, Check, Contact } from "lucide-react"

import { Button } from "@/shared/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { Switch } from "@/shared/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip"

import type { CardStyle, EditorSettings, ToolbarItem, VCardData } from "../../types/card.types"
import { VCardForm } from "./vcard/VCardForm"

interface EditorToolbarProps {
  onStyleChange: (style: Partial<CardStyle>) => void
  style: CardStyle
  settings: EditorSettings
  onSettingsChange: (settings: EditorSettings) => void
  onFormat?: (type: ToolbarItem, selection: string) => void
  selection?: string
  vcardData: Partial<VCardData>
  onVCardChange: (fieldName: keyof VCardData, value: string) => void
}

export function EditorToolbar({ 
  onStyleChange, 
  style, 
  settings, 
  onSettingsChange,
  onFormat,
  selection = "",
  vcardData,
  onVCardChange
}: EditorToolbarProps) {
  const [activeTab, setActiveTab] = useState<"format" | "style" | "view" | "vcard">("format")

  const handleSettingChange = (key: keyof EditorSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    })
  }

  const formatItems: { item: ToolbarItem; icon: React.ReactNode; tooltip: string }[] = [
    { item: "bold", icon: <Bold size={16} />, tooltip: "Жирный" },
    { item: "italic", icon: <Italic size={16} />, tooltip: "Курсив" },
    { item: "heading", icon: <Heading size={16} />, tooltip: "Заголовок" },
    { item: "quote", icon: <Quote size={16} />, tooltip: "Цитата" },
    { item: "code", icon: <Code size={16} />, tooltip: "Код" },
    { item: "link", icon: <Link size={16} />, tooltip: "Ссылка" },
    { item: "image", icon: <Image size={16} />, tooltip: "Изображение" },
    { item: "unordered-list", icon: <List size={16} />, tooltip: "Неупорядоченный список" },
    { item: "ordered-list", icon: <ListOrdered size={16} />, tooltip: "Упорядоченный список" },
    { item: "task-list", icon: <ListTodo size={16} />, tooltip: "Список задач" }
  ]

  const handleMarkdownFormat = (item: ToolbarItem) => {
    if (!onFormat) return console.log(`Format applied: ${item}`)
    
    let formattedText = ""
    
    switch(item) {
      case "bold":
        formattedText = `**${selection}**`
        break
      case "italic":
        formattedText = `*${selection}*`
        break
      case "heading":
        formattedText = `### ${selection}`
        break
      case "quote":
        formattedText = `> ${selection}`
        break
      case "code":
        formattedText = `\`${selection}\``
        break
      case "link":
        formattedText = `[${selection}](url)`
        break
      case "image":
        formattedText = `![${selection}](image-url)`
        break
      case "unordered-list":
        formattedText = `- ${selection}`
        break
      case "ordered-list":
        formattedText = `1. ${selection}`
        break
      case "task-list":
        formattedText = `- [ ] ${selection}`
        break
      default:
        formattedText = selection
    }
    
    onFormat(item, formattedText)
  }

  return (
    <div className="editor-toolbar space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "format" | "style" | "view" | "vcard")}
      >
        <TabsList>
          <TabsTrigger value="format">
            <Code className="mr-2 h-4 w-4" />
            Форматирование
          </TabsTrigger>
          <TabsTrigger value="style">
            <Layout className="mr-2 h-4 w-4" />
            Стиль
          </TabsTrigger>
          <TabsTrigger value="view">
            <Eye className="mr-2 h-4 w-4" />
            Вид
          </TabsTrigger>
          <TabsTrigger value="vcard">
            <Contact className="mr-2 h-4 w-4" />
            VCard
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "format" && (
        <div className="flex flex-wrap gap-1">
          <TooltipProvider>
            {formatItems.map((item) => (
              <Tooltip key={item.item}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMarkdownFormat(item.item)}
                  >
                    {item.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      )}

      {activeTab === "style" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Тема:</span>
            <Select
              value={style.theme}
              onValueChange={(value) => onStyleChange({ theme: value as CardStyle['theme'] })}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Тема" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center">
                    <Sun size={16} className="mr-2" />
                    <span>Светлая</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center">
                    <Moon size={16} className="mr-2" />
                    <span>Темная</span>
                  </div>
                </SelectItem>
                <SelectItem value="colorful">
                  <div className="flex items-center">
                    <SunMoon size={16} className="mr-2" />
                    <span>Цветная</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm">Макет:</span>
            <Select
              value={style.layout}
              onValueChange={(value) => onStyleChange({ layout: value as CardStyle['layout'] })}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Макет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">
                  <div className="flex items-center">
                    <Layout size={16} className="mr-2" />
                    <span>Стандартный</span>
                  </div>
                </SelectItem>
                <SelectItem value="compact">
                  <div className="flex items-center">
                    <LayoutList size={16} className="mr-2" />
                    <span>Компактный</span>
                  </div>
                </SelectItem>
                <SelectItem value="wide">
                  <div className="flex items-center">
                    <Layout size={16} className="mr-2" />
                    <span>Широкий</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {activeTab === "view" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Предпросмотр:</span>
            <Switch
              checked={settings.showPreview}
              onCheckedChange={(checked) => handleSettingChange("showPreview", checked)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm">Тёмный режим:</span>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) => handleSettingChange("darkMode", checked)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm">Автосохранение:</span>
            <Switch
              checked={settings.autoSave}
              onCheckedChange={(checked) => handleSettingChange("autoSave", checked)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm">Положение предпросмотра:</span>
            <Select
              value={settings.previewPosition}
              onValueChange={(value: "side" | "bottom") => handleSettingChange("previewPosition", value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Положение" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="side">Сбоку</SelectItem>
                <SelectItem value="bottom">Снизу</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {activeTab === "vcard" && (
        <VCardForm vcardData={vcardData} onVCardChange={onVCardChange} />
      )}
    </div>
  )
} 