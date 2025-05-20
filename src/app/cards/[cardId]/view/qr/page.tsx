"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import { generateVcfContent, downloadVcfFile } from "@/features/cards/lib/vcfUtils"
import { Button } from "@/shared/ui/button"
import { DownloadCloud } from "lucide-react"
import type { VCardData } from "@/features/cards/types/card.types"
import { fetchClient } from "@/shared/api/instance"
import { components } from "@/shared/api/schema/generated"

import { queryClient } from "@/shared/api/query-client"
import { rqClient } from "@/shared/api/instance"

type Card = components["schemas"]["Card"]
type CardStyle = Card["style"]
type QueryError = components["schemas"]["Error"]

export default function QRViewPage() {
  const params = useParams()
  const cardId = params.cardId as string
  
  const [cardName, setCardName] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [style, setStyle] = useState<CardStyle>({ theme: "light", layout: "default" })
  const [vcard, setVCard] = useState<Partial<VCardData> | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  const { data: fullCardData, isError } = useQuery<Card, QueryError>({
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
  })

  useEffect(() => {
    if (fullCardData) {
      setCardName(fullCardData.name || "Безымянная карточка")
      setContent(fullCardData.content || "")
      setStyle(fullCardData.style || { theme: "light", layout: "default" })
      setVCard(fullCardData.vcard)
      setIsLoading(false)
    } else if (isError) {
      setIsLoading(false)
    }
  }, [fullCardData, isError])

  const handleDownloadVCard = () => {
    if (vcard && Object.keys(vcard).length > 0) {
      const vcfContent = generateVcfContent(vcard)
      const filename = `${vcard.firstName || ""}${vcard.lastName || "Kontakt"}.vcf`.replace(/\s+/g, '_').toLowerCase() || "contact.vcf"
      downloadVcfFile(vcfContent, filename)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">Загрузка содержимого карточки...</p>
      </div>
    )
  }

  if (isError && !fullCardData) {
    return (
      <div className="flex h-screen items-center justify-center bg-red-50 text-red-700">
        <p className="text-lg">Ошибка при загрузке содержимого карточки.</p>
      </div>
    )
  }
  
  const themeClass = style?.theme ? `theme-${style.theme}` : 'theme-light'
  const layoutClass = style?.layout ? `layout-${style.layout}` : 'layout-default'

  return (
    <div className={`flex min-h-screen flex-col items-center bg-gray-50 p-4 pt-10 ${themeClass} ${layoutClass}`}>
      <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        {cardName && <h1 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-gray-100">{cardName}</h1>}
        <div className="prose prose-slate max-w-none dark:prose-invert">
          {content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <p className="text-center text-gray-500">Содержимое карточки отсутствует.</p>
          )}
        </div>
        
        {vcard && Object.keys(vcard).length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button onClick={handleDownloadVCard}>
              <DownloadCloud className="mr-2 h-4 w-4" />
              Скачать VCard (.vcf)
            </Button>
          </div>
        )}
      </div>
      <footer className="mt-8 text-center">
        <Link href={`/cards/${cardId}/view`} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
          Открыть карточку в приложении
        </Link>
      </footer>
    </div>
  )
} 