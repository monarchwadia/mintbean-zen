import KoaRouter from "koa-router"
import { MintbeanRouterState } from "../state/type";
import Joi, { checkPreferences } from "joi";
import { prisma, User } from "@prisma/client";
import { prismaClient } from "../../prismaClient";
import { createUser, findUserByEmail, userExists } from "../user/dao";
import { bang, bangLogError500 } from "../common/utils/http";
import { compare } from "../common/utils/crypto";
import { logger } from "../logger";

export const authRouter = new KoaRouter<MintbeanRouterState>();

authRouter.get("/login", async (ctx) => await ctx.render("auth/views/login"));

authRouter.get("/logout", async (ctx) => {
  ctx.session = null;
  return ctx.redirect("back");
});

authRouter.post("/login", async (ctx) => {
  if (!ctx.session) {
    return bangLogError500(ctx, "auth/views/login", "CRITICAL: Session was unexpectedly falsey.")
  }

  const schema = Joi.object<{email: string, password: string}>({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(64).required()
  });

  const results = schema.validate(ctx.request.body);

  if (results.error) {
    return bang(ctx, "auth/views/login", {
      flash: {
        error: "Form validation failed. Try again."
      },
      status: 400,
    })
  }

  const user = await findUserByEmail(results.value.email);

  if (!user) {
    return bang(ctx, "auth/views/login", {
      status: 409,
      flash: {
        error: "No user with that email address exists."
      }
    });
  }

  const isMatch = await compare(results.value.password, user.passwordHash);

  if (!isMatch) {
    return bang(ctx, "auth/views/login", {
      status: 409,
      flash: {
        error: "Bad email/password combo."
      }
    })
  }

  ctx.session.currentUserId = user.id;
  ctx.redirect("/");
})


// authRouter.post("/register", async (ctx) => {
//   const schema = Joi.object({
//     email: Joi.string().email().required(),
//     password: Joi.string().min(8).max(64).required()
//   });

//   const results = schema.validate(ctx.request.body);

//   if (results.error) {
//     return bang(ctx, "auth/views/register", {
//       flash: {
//         error: "Validation failed. Try again."
//       },
//       status: 400,
//     })
//   }

//   try {
//     const exists = await userExists(results.value.email);

//     if (exists) {
//       return bang(ctx, "auth/views/register", {
//         status: 409,
//         flash: {
//           error: "A user with that email already exists."
//         }
//       });
//     }
//   } catch (e) {
//     return bangLogError500(ctx, "auth/views/register", e); 
//   }

//   try {
//     await createUser({
//       email: results.value.email,
//       password: results.value.password,
//       name: results.value.name,
//       isAdmin: false,
//     });
//   } catch (e) {
//     return bangLogError500(ctx, "auth/views/register", e); 
//   }
// })
