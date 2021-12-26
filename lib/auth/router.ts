import KoaRouter from "koa-router"

export const authRouter = new KoaRouter();

authRouter.get("/login", async (ctx) => await ctx.render("auth/views/login"))


