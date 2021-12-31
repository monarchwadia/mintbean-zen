import { Middleware } from "koa";
import { MintbeanRouterState } from "../../state/type";
import { MintbeanSession } from "../types";

export const adminOnly: Middleware<MintbeanRouterState> = async (ctx, next) => {
  if (!ctx.state.isAdmin) {
    const session = ctx.session as MintbeanSession;

    session.flash = {
      error: "Access denied. You must be admin."
    }

    ctx.redirect("/");
  }
  
  await next();
}