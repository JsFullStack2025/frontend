import { useState, useEffect, useCallback } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchClient } from "@/shared/api/instance";
import type { CardUpdate, CardStyle, VCardData } from "../types/card.types";
import { components } from "@/shared/api/schema/generated";

// API'den dönen tipler
type Card = components["schemas"]["Card"];
type CardContent = components["schemas"]["CardContent"];
type QueryError = components["schemas"]["Error"];

interface UseCardEditorProps {
  cardId: string;
}

export function useCardEditor({ cardId }: UseCardEditorProps) {
  const queryClient = useQueryClient();

  const [name, setName] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [style, setStyle] = useState<CardStyle>({
    theme: "light",
    layout: "default",
  });
  const [vcardData, setVCardData] = useState<Partial<VCardData>>({});
  const [initialName, setInitialName] = useState<string>("");
  const [initialContent, setInitialContent] = useState<string>("");
  const [initialStyle, setInitialStyle] = useState<CardStyle>({
    theme: "light",
    layout: "default",
  });
  const [initialVCardData, setInitialVCardData] = useState<Partial<VCardData>>({});

  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { data: cardData, isLoading: isLoadingCardData, isError: isFetchError, error: fetchError } = useQuery<Card, QueryError>({
    queryKey: ["card", cardId],
    queryFn: async () => {
      const response = await fetchClient.GET("/cards/{cardId}", {
        params: { path: { cardId } },
      });
      
      if (response.error) {
        throw response.error;
      }
      
      if (!response.data) {
        throw new Error("Card data is null or undefined from API");
      }
      
      return response.data;
    },
    enabled: !!cardId,
    staleTime: 5 * 60 * 1000,
  });

  // Effect to update local state when cardData is fetched or changes
  useEffect(() => {
    if (cardData) {
      setName(cardData.name || "");
      setContent(cardData.content || "");
      setStyle(cardData.style || { theme: "light", layout: "default" });
      setVCardData(cardData.vcard || {});

      setInitialName(cardData.name || "");
      setInitialContent(cardData.content || "");
      setInitialStyle(cardData.style || { theme: "light", layout: "default" });
      setInitialVCardData(cardData.vcard || {});
      
      setIsLoadingData(false);
      setIsDirty(false); 
    }
  }, [cardData]);
  
  // Effect to log fetch error
  useEffect(() => {
    if (isFetchError && fetchError) {
      console.error("Original error fetching card data:", fetchError); 
      let displayMessage: string;
      if (fetchError instanceof Error) {
        displayMessage = fetchError.message;
      } else if (typeof fetchError === 'object' && fetchError !== null) {
        const err = fetchError as any;
        if (typeof err.message === 'string' && err.message.trim() !== '') {
          displayMessage = err.message;
        } else if (typeof err.detail === 'string' && err.detail.trim() !== '') { 
          displayMessage = err.detail;
        } else if (err.error && typeof err.error.message === 'string' && err.error.message.trim() !== '') {
          displayMessage = err.error.message;
        } else {
          displayMessage = "Произошла неизвестная ошибка при загрузке данных.";
        }
      } else {
        displayMessage = "Произошла неизвестная ошибка при загрузке данных.";
      }
      toast.error("Ошибка загрузки данных карточки: " + displayMessage);
    }
  }, [isFetchError, fetchError]);

  // Check for changes
  useEffect(() => {
    const dirty =
      name !== initialName ||
      content !== initialContent ||
      JSON.stringify(style) !== JSON.stringify(initialStyle) ||
      JSON.stringify(vcardData) !== JSON.stringify(initialVCardData);
    setIsDirty(dirty);
  }, [name, content, style, vcardData, initialName, initialContent, initialStyle, initialVCardData]);

  // useMutation for updating card
  const updateCardMutation = useMutation({
    mutationFn: async (payload: CardUpdate) => {
      const response = await fetchClient.PUT("/cards/{cardId}/content", {
        params: { path: { cardId } },
        body: payload,
      });
      
      if (response.error) {
        throw response.error;
      }
      
      return response.data;
    },
    onSuccess: (updatedContentData: CardContent | undefined) => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      
      setInitialName(name);
      
      if (updatedContentData) {
        const newContent = updatedContentData.content || content;
        const newStyle = updatedContentData.style || style;
        setContent(newContent);
        setStyle(newStyle);
        setInitialContent(newContent);
        setInitialStyle(newStyle);
      } else {
        setInitialContent(content);
        setInitialStyle(style);
      }
      
      toast.success("Карточка успешно обновлена!");
      setIsDirty(false); 
    },
    onError: () => {
      toast.error("Ошибка при обновлении карточки.");
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  const handleSave = useCallback(async () => {
    if (!isDirty) {
      return;
    }
    setIsSaving(true);
    
    const payload: CardUpdate = { 
      name: name, 
      content: content,
      style: style,
      vcard: Object.keys(vcardData).length > 0 ? vcardData : undefined, 
    };

    updateCardMutation.mutate(payload);
  }, [
    cardId,
    name,
    content,
    style,
    vcardData,
    isDirty,
    updateCardMutation,
  ]);

  const handleNameChange = useCallback((newName: string) => {
    setName(newName);
  }, []);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const handleStyleChange = useCallback((newStylePartial: Partial<CardStyle>) => {
    setStyle((prev: CardStyle) => ({ ...prev, ...newStylePartial }));
  }, []);

  const handleVCardChange = useCallback((fieldName: keyof VCardData, value: string) => {
    setVCardData(prev => ({
      ...prev,
      [fieldName]: value || undefined 
    }));
  }, []);

  const handleAutoSave = useCallback(() => {
    if (isDirty) {
      handleSave();
    }
  }, [isDirty, handleSave]);

  return {
    name,
    content,
    style,
    vcardData,
    initialNameFromHook: initialName,
    setName: handleNameChange, 
    setContent: handleContentChange, 
    setStyle: handleStyleChange, 
    setVCardData: handleVCardChange,
    saveCard: handleSave, 
    isLoading: isLoadingData || isLoadingCardData, 
    isSaving,
    isDirty,
    isFetchError,
    handleAutoSave,
  };
} 