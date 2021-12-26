import KoaRouter from "koa-router"
import { getChallengeBy } from "../challenge/dao";
import { MintbeanRouterState } from "../state/type";

export const challengeRouter = new KoaRouter<MintbeanRouterState>();

challengeRouter.get("/new", async (ctx) => await ctx.render("challenge/views/new"))
challengeRouter.get("/:id", async (ctx) => await ctx.render("challenge/views/view", {challenge: await getChallengeBy({id: ctx.params.id})}))


