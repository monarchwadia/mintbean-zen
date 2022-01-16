import { IMiddleware } from "koa-router";
import { createTextSpan } from "typescript";
import { prismaClient } from "../../prismaClient";
import { bang404 } from "../common/utils/http";
import { MintbeanRouterState } from "../state/type";

type Options = {
  require: boolean
}
const setChallengeById = (options?: Options): IMiddleware<MintbeanRouterState> => async (ctx, next) => {
  const isRequired = options?.require || false;

  const challenge = await prismaClient.challenge.findUnique({
    where: {
      id: ctx.params.id
    },
    include: {
      thread: {
        include: {
          comments: {
            include: {
              user: {

              }
            }
          }
        }
      },
    }
  });

  if (isRequired && !challenge) {
    return bang404(ctx);
  }

  if (challenge) {
    ctx.state.challenge = challenge;
  }

  await next();
}

export default setChallengeById;