import { getPrisma } from "../../getPrisma";

export const getChallenges = () => getPrisma().challenge.findMany({})
export const getChallengeBy = ({id}: {id: string}) => getPrisma().challenge.findUnique({where: { id }})