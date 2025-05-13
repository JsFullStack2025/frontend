import { HttpResponse, delay } from "msw"

import { ApiSchemas } from "../../schema"
import { http } from "../http"

// Функция для генерации случайного названия карточки
function generateCardName() {
	const adjectives = [
		"Важная",
		"Срочная",
		"Ключевая",
		"Приоритетная",
		"Базовая",
		"Дополнительная",
		"Вспомогательная",
		"Основная",
		"Техническая",
		"Бизнес"
	]

	const nouns = [
		"Задача",
		"Идея",
		"Заметка",
		"Мысль",
		"Пункт",
		"Элемент",
		"Шаг",
		"Действие",
		"План",
		"Цель"
	]

	const randomAdjective =
		adjectives[Math.floor(Math.random() * adjectives.length)]
	const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]

	return `${randomAdjective} ${randomNoun}`
}

// Генерация случайных карточек
function generateRandomCards(count: number): ApiSchemas["Card"][] {
	const result: ApiSchemas["Card"][] = []

	for (let i = 0; i < count; i++) {
		result.push({
			id: crypto.randomUUID(),
			name: generateCardName()
		})
	}

	return result
}

// Создаем 10 случайных карточек
const cards: ApiSchemas["Card"][] = generateRandomCards(10)

export const cardHandlers = [
	http.get("/cards", async (ctx) => {
		const url = new URL(ctx.request.url)
		const page = Number(url.searchParams.get("page") || 1)
		const limit = Number(url.searchParams.get("limit") || 10)
		const search = url.searchParams.get("search")
		const sort = url.searchParams.get("sort")

		let filteredCards = [...cards]

		// Фильтрация по поиску
		if (search) {
			filteredCards = filteredCards.filter((card) =>
				card.name.toLowerCase().includes(search.toLowerCase())
			)
		}

		// Сортировка
		if (sort) {
			filteredCards.sort((a, b) => {
				if (sort === "name") {
					return a.name.localeCompare(b.name)
				}
				return 0
			})
		}

		const total = filteredCards.length
		const totalPages = Math.ceil(total / limit)
		const startIndex = (page - 1) * limit
		const endIndex = startIndex + limit
		const paginatedCards = filteredCards.slice(startIndex, endIndex)

		return HttpResponse.json({
			list: paginatedCards,
			total,
			totalPages
		})
	}),

	http.get("/cards/{cardId}", async ({ params }) => {
		const { cardId } = params
		const card = cards.find((card) => card.id === cardId)

		if (!card) {
			return HttpResponse.json(
				{ message: "Card not found", code: "NOT_FOUND" },
				{ status: 404 }
			)
		}

		return HttpResponse.json(card)
	}),

	http.post("/cards", async ({ request }) => {
		const data = (await request.json()) as ApiSchemas["RenameCard"]
		const card: ApiSchemas["Card"] = {
			id: crypto.randomUUID(),
			name: data.name
		}

		cards.push(card)
		return HttpResponse.json(card, { status: 201 })
	}),

	http.put("/cards/{cardId}", async ({ params, request }) => {
		const { cardId } = params
		const card = cards.find((card) => card.id === cardId)

		if (!card) {
			return HttpResponse.json(
				{ message: "Card not found", code: "NOT_FOUND" },
				{ status: 404 }
			)
		}

		const data = (await request.json()) as ApiSchemas["RenameCard"]
		card.name = data.name

		return HttpResponse.json(card)
	}),

	http.delete("/cards/{cardId}", async ({ params }) => {
		const { cardId } = params
		const index = cards.findIndex((card) => card.id === cardId)
		await delay(1000)

		if (index === -1) {
			return HttpResponse.json(
				{ message: "Card not found", code: "NOT_FOUND" },
				{ status: 404 }
			)
		}

		cards.splice(index, 1)
		return new HttpResponse(null, { status: 204 })
	})
]
