import { IMiddleware } from "koa-router";
import { prismaClient } from "../../prismaClient";
import { bang404 } from "../common/utils/http";
import { MintbeanRouterState } from "../state/type";

type Options = {
  require: boolean
}
const setProjectById = (options?: Options): IMiddleware<MintbeanRouterState> => async (ctx, next) => {
  const isRequired = options?.require || false;

  const project = await prismaClient.project.findUnique({
    where: {
      id: ctx.params.id
    },
    include: {
      user: {},
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

  if (isRequired && !project) {
    return bang404(ctx);
  }

  if (project) {
    ctx.state.project = project;
  }

  await next();
}

export default setProjectById;