import KoaRouter from "koa-router"
import { MintbeanRouterState } from "../state/type";
import Joi, { checkPreferences, string } from "joi";
import { prisma, User } from "@prisma/client";
import { prismaClient } from "../../prismaClient";
import { createUser, findUserByEmail, findUserById, userExists } from "../user/dao";
import { bang, bangLogError500, bangRedirect } from "../common/utils/http";
import { compare, hash } from "../common/utils/crypto";
import { logger } from "../logger";
import { MintbeanSession } from "../common/types";
import { sendEmail } from "../email/service";
import { v4 } from "uuid";
import { add, addDays, formatDuration } from "date-fns";
import { flash } from "../common/utils/flash";

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

  const session: MintbeanSession = ctx.session;
  session.currentUserId = user.id;
  ctx.redirect("/");
})

authRouter.get("/forgot-start", async (ctx) => {
  return ctx.render("auth/views/forgot_start")
});

authRouter.post("/forgot-start", async (ctx) => {
  const schema = Joi.object<{email: string}>({
    email: Joi.string().email().required(),
  });

  const results = schema.validate(ctx.request.body);

  if (results.error) {
    return bang(ctx, "auth/views/forgot_start", {
      flash: {
        error: "Form validation failed. Try again."
      },
      status: 400,
    })
  }

  const user = await findUserByEmail(results.value.email);

  if (user && user.id && user.email) {
    const token = v4();
    const passwordResetTokenHash = await hash(token);

    await prismaClient.user.update({
      where: {
        id: user.id
      },
      data: {
        passwordResetTokenHash,
        passwordResetTokenExpiry: addDays(new Date(), 3)
      }
    })

    await sendEmail({
      recipient: user.email,
      subject: "Your password reset link.",
      templateId: "blah", // TODO: change
      data: {
        targetUrl: `${process.env.ROOT_DOMAIN}/auth/forgot-complete?passwordResetToken=${encodeURIComponent(token)}&userId=${encodeURIComponent(user.id)}`
      }
    })
  }

  // regardless of whether user is found or not, render OK
  return ctx.render("auth/views/forgot_start_confirm")
})

authRouter.get("/forgot-complete", async (ctx) => {
  const schema = Joi.object<{userId: string, passwordResetToken: string}>({
    userId: Joi.string().required(),
    passwordResetToken: Joi.string().required(),
  });

  const results = schema.validate(ctx.request.query);

  if (results.error) {
    return bangRedirect(ctx, "/auth/views/forgot-start", {
      error: "Password reset URL was malformed. Try resetting your password again."
    })
  }

  const { userId, passwordResetToken } = results.value;
  return ctx.render("auth/views/forgot_complete", {
    userId,
    passwordResetToken
  })
})

authRouter.post("/forgot-complete", async (ctx) => {
  const schema = Joi.object<{userId: string, passwordResetToken: string, newPassword: string}>({
    userId: Joi.string().required(),
    passwordResetToken: Joi.string().required(),
    newPassword: Joi.string().min(8).max(64).required()
  });

  const results = schema.validate(ctx.request.body);

  console.log("RESULTS", results.error, results.value)

  const blowUp = () => bang(ctx, "auth/views/forgot_start", {
    flash: {
      error: "Password reset URL was malformed. Try resetting your password again."
    },
    status: 400,
  })

  if (results.error) {
    return blowUp();
  }

  const { userId, passwordResetToken, newPassword } = results.value;

  const user = await findUserById(userId);

  const tokenIsValid = 
    // user was retrieved
    user
    // hash exists 
    && user.passwordResetTokenHash 
    // expiry exists
    && user.passwordResetTokenExpiry 
    // expiry is later than current dateTime
    && user.passwordResetTokenExpiry > new Date()
    // hash matches the passwordResetToken
    && await compare(passwordResetToken, user.passwordResetTokenHash);

  if (!tokenIsValid) {
    return blowUp();
  }

  const passwordHash = await hash(newPassword);

  await prismaClient.user.update({
    where: {
      id: user.id
    },
    data: {
      // invalidate reset token hash
      passwordResetTokenHash: null,
      passwordResetTokenExpiry: null,
      // set new password
      passwordHash
    }
  });

  flash(ctx, {
    success: "Password was successfully reset."
  }, {
    persistent: true
  });

  return ctx.redirect("/auth/login");
})