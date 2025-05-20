"use client"

import { useParams } from "next/navigation"
import { useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"

import { CardEditor } from "@/features/cards/components/editor/CardEditor"
import { Button } from "@/shared/ui/button"
import { fetchClient, queryClient } from "@/shared/api/instance"
import { components } from "@/shared/api/schema/generated"

type Card = components["schemas"]["Card"]
type QueryError = components["schemas"]["Error"]

export default function CardEditPage() {
  const params = useParams()
  const cardId = params.cardId as string

  const { data: card, isLoading: isLoadingCardName, error: cardNameError } = useQuery<Card, QueryError>({
    queryKey: ["cardNameForTitle", cardId],
    queryFn: async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching card:", error);
        throw error;
      }
    },
    enabled: !!cardId,
    staleTime: 5 * 60 * 1000,
  });
  
  useEffect(() => {
    if (cardNameError) {
      console.error("Error fetching card name for title:", cardNameError);
      let message = "Неизвестная ошибка при загрузке названия";
      if (cardNameError instanceof Error) {
        message = cardNameError.message;
      } else if (typeof (cardNameError as any)?.message === 'string') {
        message = (cardNameError as any).message;
      }
      // toast.error(message); 
    }
  }, [cardNameError]);

  if (isLoadingCardName) {
    return <div>Загрузка редактора...</div>;
  }

  if (!cardId) {
    return <div>Идентификатор карточки отсутствует.</div>;
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex items-center gap-4">
        <Button size="sm" variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">
          {card ? `"${card.name}" Редактирование` : "Редактирование карточки (без названия)"}
        </h1>
      </div>

      <div className="card-editor-container">
        <CardEditor cardId={cardId} />
      </div>
    </div>
  )
} 