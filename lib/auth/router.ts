import KoaRouter from "koa-router"
import { MintbeanRouterState } from "../state/type";
import Joi, { checkPreferences } from "joi";
import { prisma, User } from "@prisma/client";
import { prismaClient } from "../../prismaClient";
import { createUser, findUserByEmail, userExists } from "../user/dao";
import { bang, bangLogError500 } from "../common/utils/http";
import { compare } from "../common/utils/crypto";

export const authRouter = new KoaRouter<MintbeanRouterState>();

authRouter.get("/login", async (ctx) => await ctx.render("auth/views/login"));

authRouter.get("/logout", async (ctx) => {
  ctx.session = null;
  return ctx.redirect("back");
});

authRouter.post("/login", async (ctx) => {
  console.debug("ENTERED POST LOGIN ROUTE, SESSION IS:", ctx.session);
  if (!ctx.session) {
    return bangLogError500(ctx, "auth/views/login", "CRITICAL: Session was unexpectedly falsey.")
  }

  const schema = Joi.object<{email: string, password: string}>({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(64).required()
  });

  const results = schema.validate(ctx.request.body);

  if (results.error) {
    console.debug("VALIDATION ERRORS");
    return bang(ctx, "auth/views/login", {
      flash: {
        error: "Form validation failed. Try again."
      },
      status: 400,
    })
  }

  console.debug("FINDING USER BY EMAIL", results.value.email);
  const user = await findUserByEmail(results.value.email);

  if (!user) {
    console.debug("NO USER FOUND");
    return bang(ctx, "auth/views/login", {
      status: 409,
      flash: {
        error: "No user with that email address exists."
      }
    });
  }

  console.log("USER FOUND", user);
  const isMatch = await compare(results.value.password, user.passwordHash);

  if (!isMatch) {
    console.debug("NO MATCH");
    return bang(ctx, "auth/views/login", {
      status: 409,
      flash: {
        error: "Bad email/password combo."
      }
    })
  }

  ctx.session.currentUserId = user.id;
  console.log("SUCCESSFULLY LOGGED IN!", ctx.session);
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
//     console.log(results, ctx.body);
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
