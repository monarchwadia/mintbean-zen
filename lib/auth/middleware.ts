import { Middleware } from "koa";

export const setUser: Middleware = async (ctx, next) => {
  ctx.state.currentUser = {
    id: 1,
    email: "fake@user.com",
    name: "Fake User"
  }

  await next();
}