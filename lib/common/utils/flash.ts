import { Context } from "koa";
import { Flash } from "../../state/type";
import { MintbeanSession } from "../types";

export type FlashOptions = {
  persistent: boolean
}
export const flash = (ctx: Context, flash: Flash, options?: FlashOptions) => {
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