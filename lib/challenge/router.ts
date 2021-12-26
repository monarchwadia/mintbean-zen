import KoaRouter from "koa-router"
import { getChallengeBy, getChallenges } from "../challenge/dao";

export const challengeRouter = new KoaRouter();

challengeRouter.get("/new", async (ctx) => await ctx.render("challenge/views/new"))
challengeRouter.get("/:id", async (ctx) => await ctx.render("challenge/views/view", {challenge: await getChallengeBy({id: ctx.params.id})}))


