import { CONFIG } from "@/shared/model/config"

export default function Home() {
	"use client"
	return "Home Page " + CONFIG.API_BASE_URL
}
