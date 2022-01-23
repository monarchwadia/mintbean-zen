import { Middleware } from "koa";
import { MintbeanRouterState } from "../../state/type";
import { flash } from "../utils/flash";

export const requireAuth: Middleware<MintbeanRouterState> = async (ctx, next) => {
  if (!ctx.state.isLoggedIn) {
    flash(ctx, {
      error: "You must be logged in."
    }, { persistent: true})

    return ctx.redirect("/");
  }
  
  await next();
}