import { Middleware } from "koa";
import { MintbeanRouterState } from "../../state/type";
import { MintbeanSession } from "../types";
import { flash } from "../utils/flash";

export const adminOnly: Middleware<MintbeanRouterState> = async (ctx, next) => {
  if (!ctx.state.isAdmin) {
    const session = ctx.session as MintbeanSession;

    if (session) {
      flash(ctx, {
        error: "Access denied. You must be admin."
      }, { persistent: true})
    }

    ctx.redirect("/");
  }
  
  await next();
}