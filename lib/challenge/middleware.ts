import { IMiddleware } from "koa-router";
import { createTextSpan } from "typescript";
import { prismaClient } from "../../prismaClient";
import { bang404 } from "../common/utils/http";
import { MintbeanRouterState } from "../state/type";
import { findChallengeBy } from "./dao";

type Options = {
  require: boolean
}
const setChallengeById = (options?: Options): IMiddleware<MintbeanRouterState> => async (ctx, next) => {
  const isRequired = options?.require || false;

  const challenge = await findChallengeBy({ id: ctx.params.id });

  if (isRequired && !challenge) {
    return bang404(ctx);
  }

  if (challenge) {
    ctx.state.challenge = challenge;
  }

  await next();
}

export default setChallengeById;