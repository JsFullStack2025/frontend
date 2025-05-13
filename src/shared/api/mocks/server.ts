import { setupServer } from "msw/node"

import { authHandlers } from "./handlers/auth"
import { cardHandlers } from "./handlers/card"

export const server = setupServer(...authHandlers, ...cardHandlers)
