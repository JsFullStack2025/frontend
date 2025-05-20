import { components } from "@/shared/api/schema/generated"

/**
 * Модель карточки
 */
export type Card = components["schemas"]["Card"] & {
  vcard?: VCardData;
};

/**
 * Модель содержимого карточки
 */
export type CardContent = components["schemas"]["CardContent"]

/**
 * Стиль карточки
 */
export interface CardStyle {
  theme: "light" | "dark" | "colorful"
  layout: "default" | "compact" | "wide"
  customCss?: string
}

/**
 * VCard Data Structure
 */
export interface VCardData {
  firstName?: string;
  lastName?: string;
  organization?: string;
  title?: string;
  phoneWork?: string;
  phoneMobile?: string;
  email?: string;
  website?: string;
  addressStreet?: string;
  addressCity?: string;
  addressRegion?: string;
  addressPostalCode?: string;
  addressCountry?: string;
  note?: string;
}

/**
 * Обновление карточки
 */
export interface CardUpdate {
  name?: string
  content?: string
  style?: CardStyle
  vcard?: VCardData
}

/**
 * Модель черновика карточки
 */
export type CardDraft = components["schemas"]["CardDraft"]

/**
 * Состояние редактора
 */
export interface EditorState {
  cardId: string
  content: string
  style: CardStyle
  isLoading: boolean
  isSaving: boolean
  isDirty: boolean
  hasError: boolean
  errorMessage?: string
}

/**
 * Настройки редактора
 */
export interface EditorSettings {
  autoSave: boolean
  showPreview: boolean
  previewPosition: "side" | "bottom"
  darkMode: boolean
}

/**
 * Элемент панели инструментов
 */
export type ToolbarItem = "bold" | "italic" | "heading" | "quote" | "code" | "link" | "image" | "unordered-list" | "ordered-list" | "task-list" 