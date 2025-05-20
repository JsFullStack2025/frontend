"use client"

import { Plus, Trash2, Edit, File } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardFooter } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { queryClient } from "@/shared/api/query-client"
import { rqClient } from "@/shared/api/instance"
export function CardsList() {
	const [newCardName, setNewCardName] = useState("")

	const { data, isLoading } = rqClient.useQuery("get", "/cards")

	const createCardMutation = rqClient.useMutation("post", "/cards", {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["get", "/cards"] })
			toast.success("Карточка создана")
			setNewCardName("")
		},
		onError: () => {
			toast.error("Не удалось создать карточку")
		}
	})

	const deleteCardMutation = rqClient.useMutation("delete", "/cards/{cardId}", {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["get", "/cards"] })
			toast.success("Карточка удалена")
		},
		onError: () => {
			toast.error("Не удалось удалить карточку")
		}
	})

	const handleCreateCard = () => {
		if (!newCardName.trim()) {
			toast.error("Введите название карточки")
			return
		}
		createCardMutation.mutate({ 
			name: newCardName,
			content: "# Новая карточка\n\nЗдесь вы можете написать содержимое.",
			style: {
				theme: "light",
				layout: "default"
			}
		})
	}

	const handleDeleteCard = (cardId: string) => {
		deleteCardMutation.mutate({ params: { path: { cardId } } })
	}

	if (isLoading) {
		return <div>Загрузка...</div>
	}

	return (
		<div className="container mx-auto space-y-4 p-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Карточки</h1>
			</div>

			<div className="flex gap-4">
				<Input
					placeholder="Название новой карточки..."
					value={newCardName}
					onChange={(e) => setNewCardName(e.target.value)}
					className="max-w-sm"
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							handleCreateCard()
						}
					}}
				/>
				<Button
					onClick={handleCreateCard}
					disabled={createCardMutation.isPending || !newCardName.trim()}
				>
					<Plus className="mr-2 h-4 w-4" />
					Добавить карточку
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{data?.list.map((card) => (
					<Card key={card.id} className="flex flex-col">
						<CardContent className="pt-6">
							<div className="flex items-start justify-between">
								<h3 className="text-lg font-medium">{card.name}</h3>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleDeleteCard(card.id)}
									disabled={deleteCardMutation.isPending}
								>
									<Trash2 className="h-4 w-4 text-red-500" />
								</Button>
							</div>
						</CardContent>
						<CardFooter className="flex justify-end gap-2 pt-2">
							<Button variant="outline" size="sm" asChild>
								<Link href={`/cards/${card.id}/view`}>
									<File className="mr-2 h-4 w-4" />
									Просмотр
								</Link>
							</Button>
							<Button variant="outline" size="sm" asChild>
								<Link href={`/cards/${card.id}/edit`}>
									<Edit className="mr-2 h-4 w-4" />
									Редактировать
								</Link>
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>

			{data?.list.length === 0 && (
				<div className="py-8 text-center text-gray-500">
					Карточки не найдены
				</div>
			)}
		</div>
	)
}
