import KoaRouter from "koa-router"
import { getChallenges } from "../challenge/dao";
import { MintbeanRouterState } from "../state/type";

export const homeRouter = new KoaRouter<MintbeanRouterState>();

// root route
homeRouter.get("/", async (ctx) => {
  await ctx.render("home/views/index", { challenges: await getChallenges()})
})
