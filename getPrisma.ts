import { Prisma, PrismaClient } from "@prisma/client";

let instance: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;

export const getPrisma = () => {
  if (!instance) {
    instance = new PrismaClient();
  }

  return instance;
}