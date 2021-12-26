import KoaRouter from "koa-router"
import { MintbeanRouterState } from "../state.type";

export const authRouter = new KoaRouter<MintbeanRouterState>();

authRouter.get("/login", async (ctx) => await ctx.render("auth/views/login"))


