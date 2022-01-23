import { prisma } from "@prisma/client";
import Joi from "joi";
import Router from "koa-router";
import KoaRouter from "koa-router"
import { requireAuth } from "../common/middleware/requireAuth";
import { processMarkdown } from "../common/views/helpers/markdown";
import { MintbeanRouterState } from "../state/type";

export const markdownPreviewRouter = new KoaRouter<MintbeanRouterState>();

markdownPreviewRouter.use(requireAuth);

markdownPreviewRouter.post("/", (ctx) => {
  const schema = Joi.object<{markdown: string}>({
    markdown: Joi.string().required()
  });

  const results = schema.validate(ctx.request.body);

  if (results.error) {
    ctx.status = 400;
    ctx.body = {
      error: "Request body validation failed."
    }
    return;
  }

  ctx.body = {
    html: processMarkdown(results.value.markdown)
  }
})