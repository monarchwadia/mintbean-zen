import KoaRouter from "koa-router"
import { prismaClient } from "../../prismaClient";
import { bang404 } from "../common/utils/http";
import { MintbeanRouterState } from "../state/type";
import { createCommentTree } from "../thread/utils";

export const challengeRouter = new KoaRouter<MintbeanRouterState>();

challengeRouter.get("/:id", async (ctx) => {
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

  if (!challenge) {
    return bang404(ctx)
  }

  const commentTree = createCommentTree(challenge.thread.comments);

  await ctx.render("challenge/views/view", {
    challenge,
    commentTree
  })
})
