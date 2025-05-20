"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"

import { rqClient } from "@/shared/api/instance"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader } from "@/shared/ui/card"
import { EditorPreview } from "@/features/cards/components/editor/EditorPreview"
import type { CardStyle } from "@/features/cards/types/card.types"

export default function CardViewPage() {
  const params = useParams<{ cardId: string }>()
  const cardId = params.cardId
  const [cardName, setCardName] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [style, setStyle] = useState<CardStyle>({
    theme: "light",
    layout: "default"
  })

  // Получить информацию о карточке
  const { data: cardData, isLoading: isCardLoading } = rqClient.useQuery("get", "/cards/{cardId}", {
    params: {
      path: { cardId }
    },
    enabled: !!cardId
  })

  // Получить содержимое карточки
  const { data: contentData, isLoading: isContentLoading } = rqClient.useQuery("get", "/cards/{cardId}/content", {
    params: {
      path: { cardId }
    },
    enabled: !!cardId
  })

  useEffect(() => {
    if (cardData) {
      setCardName(cardData.name || "")
    }
  }, [cardData])

  useEffect(() => {
    if (contentData) {
      setContent(contentData.content || "")
      if (contentData.style) {
        setStyle(contentData.style)
      }
    }
  }, [contentData])

  const isLoading = isCardLoading || isContentLoading

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button size="sm" variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">
            {isLoading ? "Загрузка..." : cardName}
          </h1>
        </div>

        <Button size="sm" variant="outline" asChild>
          <Link href={`/cards/${cardId}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Редактировать
          </Link>
        </Button>
      </div>

      <Card className="min-h-[400px]">
        {isLoading ? (
          <CardContent className="flex h-40 items-center justify-center">
            <p>Загрузка содержимого...</p>
          </CardContent>
        ) : (
          <>
            <CardHeader>
              <h2 className="text-xl font-semibold">{cardName}</h2>
            </CardHeader>
            <CardContent>
              <div className="prose-content">
                <EditorPreview content={content} style={style} />
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
} 