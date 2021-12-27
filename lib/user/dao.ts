import { User } from "@prisma/client"
import { prismaClient } from "../../prismaClient";
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
    email: params.email.trim().toLowerCase(),
    createdAt: null,
    passwordHash: await hash(params.password)
  }

  // @ts-expect-error For ergonomic reasons, this property exists on params.
  // We're removing it here so prisma doesn't freak out.
  delete user.password;

  return prismaClient.user.create({ data: user })
}

export const userExists = async (email: string) => {
  const user = await prismaClient.user.findFirst({
    where: {
      email: email.trim().toLowerCase()
    }
  });

  return !!user;
}

export const findUserByEmail = async (email: string) => {
  const user = await prismaClient.user.findFirst({
    where: {
      email: email.trim().toLowerCase()
    }
  });

  return user;
}

export const findUserById = async (id: string) => {
  const user = await prismaClient.user.findFirst({
    where: {
      id
    }
  });

  return user;
}