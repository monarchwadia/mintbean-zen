import KoaRouter from "koa-router"
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

