import { Context } from "koa";
import { Flash } from "../../state/type";
import { MintbeanSession } from "../types";

type Options = {
  persistent: boolean
}
export const flash = (ctx: Context, flash: Flash, options?: Options) => {
  const session: MintbeanSession | null = ctx.session;
  const state = ctx.state;

  if (state) {
    state.flash = flash;
  }

  // set persistent flash if requested
  if (session && options?.persistent) {
    session.flash = flash;
  }
}