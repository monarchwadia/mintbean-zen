import Joi from "joi";
import KoaRouter from "koa-router"
import { prismaClient } from "../../prismaClient";
import { requireAuth } from "../common/middleware/requireAuth";
import { flash } from "../common/utils/flash";
import { bang, bangRedirect } from "../common/utils/http";
import { MintbeanRouterState } from "../state/type";
import { createCommentTree } from "../thread/utils";
import setProjectById from "./middleware";

export const projectRouter = new KoaRouter<MintbeanRouterState>();

projectRouter.get("/:id", setProjectById({ require: true }), async (ctx) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const project = ctx.state.project!;
  
  const commentTree = createCommentTree(project.thread.comments);

  await ctx.render("project/views/view", {
    challenge: project,
    commentTree
  })
});

projectRouter.post("/", requireAuth, async (ctx) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(1).max(64).required(),
    description: Joi.string().trim().min(1).max(140).required(),
    challengeId: Joi.string().required(),
    deployedUrl: Joi.string().required(),
    githubUrl: Joi.string().required()
  }).required()

  const results = schema.validate(ctx.request.body);

  console.log("REFERER", ctx.headers.referer)

  if (results.error) {
    return bangRedirect(ctx, ctx.headers.referer || "/", {
      error: results.error.message
    })
  }

  const { title, description, challengeId, deployedUrl, githubUrl } = results.value;

  const newProject = await prismaClient.project.create({
    data: {
      title,
      description,
      deployedUrl,
      githubUrl,
      thread: {
        create: {}
      },
      challenge: {
        connect: {
          id: challengeId
        }
      },
      user: {
        connect: {
          id: ctx.state.currentUserId,
        }
      }
    },
  })

  flash(ctx, {
    success: "Successfully submitted project."
  }, {
    persistent: true
  });

  return ctx.redirect(`/project/${newProject.id}`)
})