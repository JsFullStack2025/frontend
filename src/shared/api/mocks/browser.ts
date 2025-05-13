import { setupWorker } from "msw/browser"

import { authHandlers } from "./handlers/auth"
import { cardHandlers } from "./handlers/card"

export const worker = setupWorker(...authHandlers, ...cardHandlers)
