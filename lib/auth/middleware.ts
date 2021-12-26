import { Middleware } from "koa";

export const setUser: Middleware = async (ctx, next) => {
  ctx.state.currentUser = {
    id: 1,
    email: "fake@user.comx",
    name: "Fake User"
  }

  await next();
}