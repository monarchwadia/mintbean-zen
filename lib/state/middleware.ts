import { Middleware } from "koa";
import { prismaClient } from "../../prismaClient";
import { bang } from "../common/utils/http";
import { findUserById } from "../user/dao";
import * as _ from "./type"
import { MintbeanRouterState } from "./type";

export const setUserMiddleware: Middleware<MintbeanRouterState> = async (ctx, next) => {
  // console.debug("ENTERED SETUSERMIDDLEWARE");
  // defensively set this to false
  ctx.state.isLoggedIn = false

  const currentUserId = ctx.session?.currentUserId;

  if (!currentUserId) {
    console.debug("USER ID NOT SET ON SESSION");
    return await next();
  }

  let user;
  try {
    user = await findUserById(currentUserId);
  } catch (e) {
    console.error("Error while trying to find user by session ID", e);
    ctx.session = null;
    return await next();
  }

  if (!user) {
    console.debug("USER WITH THIS ID NOT FOUND");
    ctx.session = null;
    return await next();
  }

  // finally, sunny case
  console.debug("SUCCESS", user);
  ctx.state.currentUser = user;
  ctx.state.currentUserId = user.id;
  ctx.state.isAdmin = user.isAdmin;
  ctx.state.isLoggedIn = true;

  await next();
}