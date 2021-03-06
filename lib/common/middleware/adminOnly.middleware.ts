import { Middleware } from "koa";
import { MintbeanRouterState } from "../../state/type";
import { MintbeanSession } from "../types";
import { flash } from "../utils/flash";

export const adminOnly: Middleware<MintbeanRouterState> = async (ctx, next) => {
  if (!ctx.state.isAdmin) {
    flash(ctx, {
      error: "Access denied. You must be admin."
    }, { persistent: true})

    return ctx.redirect("/");
  }
  
  await next();
}