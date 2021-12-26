import KoaRouter from "koa-router"
import { getChallengeBy, getChallenges } from "../challenge/dao";

export const authRouter = new KoaRouter();

authRouter.get("/login", async (ctx) => await ctx.render("auth/views/login"))


