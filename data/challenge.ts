import { getPrisma } from "../getPrisma";

export const getChallenges = async () => getPrisma().challenge.findMany({})