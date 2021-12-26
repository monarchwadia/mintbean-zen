import { Middleware } from "koa";
import * as _ from "./type"
import { MintbeanRouterState } from "./type";

export const setUserMiddleware: Middleware<MintbeanRouterState> = async (ctx, next) => {
  ctx.state.currentUserId = "1";

  ctx.state.currentUser = {
    id: ctx.state.currentUserId,
    email: "fake@user.com",
    name: "Fake User",
    createdAt: null,
    isAdmin: false,
    passwordHash: ""
  }

  ctx.state.isAdmin = ctx.state.currentUser.isAdmin;
  ctx.state.isLoggedIn = !!ctx.state.currentUser;

  await next();
}