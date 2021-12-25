import { getPrisma } from "../getPrisma";

export const getChallenges = async () => getPrisma().challenge.findMany({})
export const getChallengeBy = async ({id}: {id: string}) => getPrisma().challenge.findUnique({where: {
  id
}})