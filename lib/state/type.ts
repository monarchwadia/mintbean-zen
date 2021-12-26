import { User } from "@prisma/client";

export interface MintbeanRouterState {
  // data
  currentUserId?: string
  currentUser?: User

  // helpers
  isLoggedIn: boolean
  isAdmin: boolean
}
