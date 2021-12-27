import { User } from "@prisma/client";
import Joi from "joi";

type SuccessFlash = {success: string, error?: void}
type ErrorFlash = {success?: void, error: string}
export type Flash = SuccessFlash | ErrorFlash;

export interface MintbeanRouterState {
  // data
  currentUserId?: string
  currentUser?: User

  // flash
  flash?: Flash;

  // validationResults
  validationResults?: Joi.ValidationResult

  // helpers
  isLoggedIn: boolean
  isAdmin: boolean
}
