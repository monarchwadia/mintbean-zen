import bcrypt from "bcrypt"

export const hash = (password: string): Promise<string> => bcrypt.hash(password, 10)

export const compare = (stringToCompare: string, encrypted: string): Promise<boolean> =>
  bcrypt.compare(stringToCompare, encrypted)