"use client";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea"; // For note field if needed
import type { VCardData } from "@/features/cards/types/card.types";
import type React from 'react'; // Import for React type

interface VCardFormProps {
  vcardData: Partial<VCardData>;
  onVCardChange: (fieldName: keyof VCardData, value: string) => void;
}

const formFields: Array<{ name: keyof VCardData; label: string; type?: string; isTextarea?: boolean }> = [
  { name: "firstName", label: "Имя" },
  { name: "lastName", label: "Фамилия" },
  { name: "organization", label: "Организация" },
  { name: "title", label: "Должность" },
  { name: "phoneWork", label: "Рабочий телефон", type: "tel" },
  { name: "phoneMobile", label: "Мобильный телефон", type: "tel" },
  { name: "email", label: "Электронная почта", type: "email" },
  { name: "website", label: "Веб-сайт", type: "url" },
  { name: "addressStreet", label: "Улица, дом" },
  { name: "addressCity", label: "Город" },
  { name: "addressRegion", label: "Регион/Область" },
  { name: "addressPostalCode", label: "Почтовый индекс" },
  { name: "addressCountry", label: "Страна" },
  { name: "note", label: "Примечание", isTextarea: true },
];

export function VCardForm({ vcardData, onVCardChange }: VCardFormProps) {
  return (
    <div className="space-y-4 p-1">
      {formFields.map((field) => (
        <div key={field.name} className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-center">
          <Label htmlFor={field.name} className="sm:text-right sm:col-span-1">
            {field.label}:
          </Label>
          <div className="sm:col-span-2">
            {field.isTextarea ? (
              <Textarea
                id={field.name}
                value={vcardData[field.name] || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onVCardChange(field.name, e.target.value)}
                placeholder={field.label}
                rows={3}
              />
            ) : (
              <Input
                id={field.name}
                type={field.type || "text"}
                value={vcardData[field.name] || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onVCardChange(field.name, e.target.value)}
                placeholder={field.label}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 