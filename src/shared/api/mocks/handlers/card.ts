import { HttpResponse } from "msw"

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
			name: generateCardName(),
			content: "# Содержимое карточки\n\nЭто пример содержимого.",
			style: {
				theme: "light",
				layout: "default"
			},
			vcard: {},
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		})
	}

	return result
}

// Создаем 10 случайных карточек
const cards: ApiSchemas["Card"][] = generateRandomCards(10)

// Ensure that a specific card ID used in tests is always present
const testCardId = "a2ff3bc5-01c7-4874-ab35-98a6895614ca";
const testCardIndex = cards.findIndex(card => card.id === testCardId);

if (testCardIndex !== -1) {

	cards[testCardIndex].name = "Тестовая карта QR (Обновлено)";
	cards[testCardIndex].content = "# Тестовый QR контент\n\nЭто содержимое для тестовой QR карты.";
	cards[testCardIndex].style = { theme: "dark", layout: "compact" };
	cards[testCardIndex].vcard = { // Sample VCard data
		firstName: "Иван",
		lastName: "Петров",
		organization: "ООО \"Тест Инк.\"",
		title: "Разработчик",
		phoneWork: "+7 (495) 123-45-67",
		phoneMobile: "+7 (916) 765-43-21",
		email: "ivan.petrov@example.com",
		website: "https://example.com",
		addressStreet: "ул. Тестовая, д. 1, оф. 42",
		addressCity: "Москва",
		addressRegion: "Московская обл.",
		addressPostalCode: "123456",
		addressCountry: "Россия",
		note: "Это тестовая vCard."
	};
} else if (cards.length > 0) {

	cards[0].id = testCardId;
	cards[0].name = "Тестовая карта QR";
	cards[0].content = "# Тестовый QR контент\n\nЭто содержимое для тестовой QR карты.";
	cards[0].style = { theme: "dark", layout: "compact" };
	cards[0].vcard = { // Sample VCard data
		firstName: "Иван",
		lastName: "Петров",
		organization: "ООО \"Тест Инк.\"",
		title: "Разработчик",
		phoneWork: "+7 (495) 123-45-67",
		phoneMobile: "+7 (916) 765-43-21",
		email: "ivan.petrov@example.com",
		website: "https://example.com",
		addressStreet: "ул. Тестовая, д. 1, оф. 42",
		addressCity: "Москва",
		addressRegion: "Московская обл.",
		addressPostalCode: "123456",
		addressCountry: "Россия",
		note: "Это тестовая vCard."
	};
} else {
	// If no cards exist (e.g. generateRandomCards(0)), add a new test card
	cards.push({
		id: testCardId,
		name: "Тестовая карта QR",
		content: "# Тестовый QR контент\n\nЭто содержимое для тестовой QR карты.",
		style: { theme: "dark", layout: "compact" },
		vcard: { // Sample VCard data
			firstName: "Иван",
			lastName: "Петров",
			organization: "ООО \"Тест Инк.\"",
			title: "Разработчик",
			phoneWork: "+7 (495) 123-45-67",
			phoneMobile: "+7 (916) 765-43-21",
			email: "ivan.petrov@example.com",
			website: "https://example.com",
			addressStreet: "ул. Тестовая, д. 1, оф. 42",
			addressCity: "Москва",
			addressRegion: "Московская обл.",
			addressPostalCode: "123456",
			addressCountry: "Россия",
			note: "Это тестовая vCard."
		},
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	});
}

// Для хранения черновиков
const drafts: ApiSchemas["CardDraft"][] = []

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
		const data = (await request.json()) as ApiSchemas["Card"]
		const card: ApiSchemas["Card"] = {
			id: crypto.randomUUID(),
			name: data.name,
			content: data.content || "# Новая карточка\n\nЗдесь вы можете написать содержимое.",
			style: data.style || {
				theme: "light",
				layout: "default"
			},
			vcard: data.vcard || {},
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
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

		if (index === -1) {
			return HttpResponse.json(
				{ message: "Card not found", code: "NOT_FOUND" },
				{ status: 404 }
			)
		}

		cards.splice(index, 1)
		return new HttpResponse(null, { status: 204 })
	}),

	// API ЭНДПОИНТЫ РЕДАКТОРА КАРТОЧЕК
	
	// Получить содержимое карточки
	http.get("/cards/{cardId}/content", async ({ params }) => {
		const { cardId } = params as { cardId: string }
		const card = cards.find((c) => c.id === cardId)

		if (!card) {
			return HttpResponse.json(
				{ message: "Card not found for content", code: "NOT_FOUND" },
				{ status: 404 }
			)
		}
		const cardContent: ApiSchemas["CardContent"] = {
			content: card.content || "",
			style: card.style || { theme: "light", layout: "default" }
		}
		return HttpResponse.json(cardContent)
	}),

	// Обновить содержимое карточки
	http.put("/cards/{cardId}/content", async ({ params, request }) => {
		const { cardId } = params as { cardId: string }
		const cardIndex = cards.findIndex((c) => c.id === cardId)

		if (cardIndex === -1) {
			return HttpResponse.json(
				{ message: "Card not found for content update", code: "NOT_FOUND" },
				{ status: 404 }
			)
		}

		const data = (await request.json()) as ApiSchemas["CardUpdate"]

		console.log(`[MSW] PUT /cards/${cardId}/content request body:`, data);

		if (data.content !== undefined && data.content !== null) {
			cards[cardIndex].content = data.content
		}
		if (data.style) {
			cards[cardIndex].style = { ...cards[cardIndex].style, ...data.style }
		}
		if (data.vcard) {
			cards[cardIndex].vcard = { ...cards[cardIndex].vcard, ...data.vcard }
		}
		if (data.name) {
		    cards[cardIndex].name = data.name;
		}
		cards[cardIndex].updatedAt = new Date().toISOString()

		console.log(`[MSW] Updated card ${cardId} in mock:`, cards[cardIndex]);

		const responseContent: ApiSchemas["CardContent"] = {
			content: cards[cardIndex].content || "",
			style: cards[cardIndex].style || { theme: "light", layout: "default" }
		}
		return HttpResponse.json(responseContent)
	}),

	// Сохранить как черновик
	http.post("/cards/{cardId}/drafts", async ({ params, request }) => {
		const { cardId } = params as { cardId: string }
		const card = cards.find((card) => card.id === cardId)

		if (!card) {
			return HttpResponse.json(
				{ message: "Card not found, cannot create draft", code: "NOT_FOUND" },
				{ status: 404 }
			)
		}

		const data = (await request.json()) as ApiSchemas["CardContent"]
		const draft: ApiSchemas["CardDraft"] = {
			id: crypto.randomUUID(),
			cardId,
			content: data.content,
			style: data.style,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		}

		drafts.push(draft)
		return HttpResponse.json(draft, { status: 201 })
	}),

	// Получить черновики
	http.get("/cards/{cardId}/drafts", async ({ params }) => {
		const { cardId } = params as { cardId: string }
		const cardDrafts = drafts.filter(draft => draft.cardId === cardId)
		const draftsListResponse: ApiSchemas["DraftsList"] = {
			list: cardDrafts,
			total: cardDrafts.length
		};
		return HttpResponse.json(draftsListResponse)
	}),

	// Получить детали черновика
	http.get("/cards/{cardId}/drafts/{draftId}", async ({ params }) => {
		const { cardId, draftId } = params as { cardId: string, draftId: string }
		const draft = drafts.find(d => d.cardId === cardId && d.id === draftId)

		if (!draft) {
			return HttpResponse.json(
				{ message: "Draft not found", code: "NOT_FOUND" },
				{ status: 404 }
			)
		}

		return HttpResponse.json(draft)
	}),

	// Удалить черновик
	http.delete("/cards/{cardId}/drafts/{draftId}", async ({ params }) => {
		const { cardId, draftId } = params as { cardId: string, draftId: string }
		const index = drafts.findIndex(d => d.cardId === cardId && d.id === draftId)

		if (index === -1) {
			return HttpResponse.json(
				{ message: "Draft not found", code: "NOT_FOUND" },
				{ status: 404 }
			)
		}

		drafts.splice(index, 1)
		return new HttpResponse(null, { status: 204 })
	})
]
