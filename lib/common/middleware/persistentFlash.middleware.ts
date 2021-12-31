import { Middleware } from "koa";
import { MintbeanRouterState } from "../../state/type";
import { staticMiddleware } from "../../static/middleware";
import { MintbeanSession } from "../types";

export const persistentFlashMiddleware: Middleware<MintbeanRouterState> = async (ctx, next) => {
  const session = ctx.session as MintbeanSession;

  if (session?.flash) {
    ctx.state.flash = session.flash;
    session.flash = undefined;
  }

  await next();
}