import { Challenge, Prisma, User } from "@prisma/client";
import Joi from "joi";

type SuccessFlash = {success: string, error?: void}
type ErrorFlash = {success?: void, error: string}
export type Flash = SuccessFlash | ErrorFlash;

const challengeWithThread = Prisma.validator<Prisma.ChallengeArgs>()({
  include: {
    thread: {
      include: {
        comments: {
          include: {
            user: {

            }
          }
        }
      }
    },
  }
})

export interface MintbeanRouterState {
  // data
  currentUserId?: string
  currentUser?: User
  challenge?: Prisma.ChallengeGetPayload<typeof challengeWithThread>

  // flash
  flash?: Flash;

  // validationResults
  validationResults?: Joi.ValidationResult

  // helpers
  isLoggedIn: boolean
  isAdmin: boolean
}
