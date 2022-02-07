import { Challenge, Prisma } from "@prisma/client"
import { prismaClient } from "../../prismaClient"

export const getChallenges = () => prismaClient.challenge.findMany({})

export const findChallengeBy = (where: Prisma.ChallengeWhereUniqueInput) => prismaClient.challenge.findUnique({
  where,
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