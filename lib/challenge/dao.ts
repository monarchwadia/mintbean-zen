import { prismaClient } from "../../prismaClient"

export const getChallenges = () => prismaClient.challenge.findMany({})
export const getChallengeBy = ({id}: {id: string}) => prismaClient.challenge.findUnique({where: { id }})