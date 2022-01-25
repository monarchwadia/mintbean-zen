import KoaRouter, { IMiddleware } from "koa-router"
import { prismaClient } from "../../prismaClient";
import { MintbeanRouterState } from "../state/type";
import { createCommentTree } from "../thread/utils";
import setChallengeById from "./middleware";

export const challengeRouter = new KoaRouter<MintbeanRouterState>();

challengeRouter.get("/:id", setChallengeById({ require: true }), async (ctx) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const challenge = ctx.state.challenge!;
  
  const commentTree = createCommentTree(challenge.thread.comments);

  await ctx.render("challenge/views/view", {
    challenge,
    commentTree
  })
});

challengeRouter.get("/:id/gallery", setChallengeById({ require: true }), async (ctx) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const challenge = ctx.state.challenge!;

  const projects = await prismaClient.project.findMany({
    where: {
      challengeId: challenge.id
    },
    include: {
      user: {
        
      }
    }
  })

  await ctx.render("challenge/views/gallery", {
    challenge,
    projects
  })
});

challengeRouter.get("/:id/submit-project", setChallengeById({ require: true }), async (ctx) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const challenge = ctx.state.challenge!;

  await ctx.render("challenge/views/submit_project", {
    challenge
  })
})