import { User } from "@prisma/client"
import { getPrisma } from "../../getPrisma"
import { hash } from "../common/utils/crypto";

// replace "passwordHash" with "password"
type CreateUserParams = Omit<
  User, 
  | "passwordHash" 
  | "id" 
  | "createdAt"
> 
& { 
  password: string;
};

export const createUser = async (params: CreateUserParams) => {
  const user = {
    ...params,
    createdAt: null,
    passwordHash: await hash(params.password)
  }

  // @ts-expect-error For ergonomic reasons, this property exists on params.
  // We're removing it here so prisma doesn't freak out.
  delete user.password;

  return getPrisma().user.create({ data: user })
}