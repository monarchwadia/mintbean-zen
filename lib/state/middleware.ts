import { Middleware } from "koa";
import { prismaClient } from "../../prismaClient";
import { MintbeanSession } from "../common/types";
import { bang } from "../common/utils/http";
import { logger } from "../logger";
import { findUserById } from "../user/dao";
import * as _ from "./type"
import { MintbeanRouterState } from "./type";

export const setUserMiddleware: Middleware<MintbeanRouterState> = async (ctx, next) => {
  ctx.state.isLoggedIn = false

  const session = ctx.session as MintbeanSession | null;
  const currentUserId = session?.currentUserId;

  if (!currentUserId) {
    return await next();
  }

  let user;
  try {
    user = await findUserById(currentUserId);
  } catch (e) {
    logger.debug("Error while trying to find user by session ID", e);
    ctx.session = null;
    return await next();
  }

  if (!user) {
    logger.debug(`User with id ${currentUserId} not found`);
    ctx.session = null;
    return await next();
  }

  // finally, sunny case
  ctx.state.currentUser = user;
  ctx.state.currentUserId = user.id;
  ctx.state.isAdmin = user.isAdmin;
  ctx.state.isLoggedIn = true;

  await next();
}