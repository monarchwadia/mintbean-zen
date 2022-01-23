import { prisma } from "@prisma/client";
import Joi from "joi";
import KoaRouter from "koa-router"
import { prismaClient } from "../../prismaClient";
import { getChallenges } from "../challenge/dao";
import { adminOnly } from "../common/middleware/adminOnly.middleware";
import { flash } from "../common/utils/flash";
import { bang } from "../common/utils/http";
import { MintbeanRouterState } from "../state/type";

export const adminRouter = new KoaRouter<MintbeanRouterState>();

adminRouter.use(adminOnly)

const r = (route: string, viewPath: string) => {
  adminRouter.get(route, async (ctx) => await ctx.render(viewPath))
}

adminRouter.get("/challenge", async (ctx) => {
  const challenges = await prismaClient.challenge.findMany({
    where: {}
  });
  
  return ctx.render("admin/views/challenge/index", { challenges })
})

adminRouter.get("/challenge/create", async (ctx) => {
  return ctx.render("admin/views/challenge/create")
})

adminRouter.get("/challenge/:id", async (ctx) => {
  const challenge = await prismaClient.challenge.findUnique({
    where: { id: ctx.params.id}
  });
  
  return ctx.render("admin/views/challenge/view", { challenge })
})

adminRouter.get("/challenge/:id/edit", async (ctx) => {
  const challenge = await prismaClient.challenge.findUnique({
    where: { id: ctx.params.id}
  });
  
  return ctx.render("admin/views/challenge/edit", { challenge })
})

adminRouter.post("/challenge/create", adminOnly, async (ctx) => {
  const schema = Joi.object({
    id: Joi.forbidden(),
    title: Joi.string().trim().min(1).max(64).required(),
    description: Joi.string().trim().min(1).max(140).required(),
    instructions: Joi.string().trim().min(1).required(),
  }).required()

  const results = schema.validate(ctx.request.body);

  if (results.error) {
    return bang(ctx, "admin/views/challenge/create", {
      flash: {
        error: results.error.message
      },
      status: 400,
    })
  }

  const { value } = results;

  const existingChallenge = await prismaClient.challenge.findUnique({
    where: {
      title: value.title
    }
  });

  if (existingChallenge) {
    return bang(ctx, "admin/views/challenge/create", {
      flash: {
        error: "Challenge with that title already exists."
      },
      locals: { challenge: value },
      status: 409
    })
  }

  const newChallenge = await prismaClient.challenge.create({
    data: {
      ...value,
      thread: {
        create: {}
      }
    }
  });

  flash(ctx, {
    success: "Successfully created challenge."
  }, {
    persistent: true
  })

  return ctx.redirect(`/admin/challenge/${newChallenge.id}`)
})

r("/", "admin/views/index");