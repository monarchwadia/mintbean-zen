import { prismaClient } from "../../prismaClient"

export const getChallenges = () => prismaClient.challenge.findMany({})