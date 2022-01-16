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
});

const projectWithThread = Prisma.validator<Prisma.ProjectArgs>()({
  include: {
    user: {},
    thread: {
      include: {
        comments: {
          include: {
            user: {

            }
          }
        },
      }
    },
  }
});

export interface MintbeanRouterState {
  // data
  currentUserId?: string
  currentUser?: User
  challenge?: Prisma.ChallengeGetPayload<typeof challengeWithThread>
  project?: Prisma.ProjectGetPayload<typeof projectWithThread>

  // flash
  flash?: Flash;

  // validationResults
  validationResults?: Joi.ValidationResult

  // helpers
  isLoggedIn: boolean
  isAdmin: boolean
}
