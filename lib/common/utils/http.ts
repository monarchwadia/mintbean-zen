import { Context, ParameterizedContext } from "koa";
import {StatusCodes, getReasonPhrase} from "http-status-codes";
import { Flash, MintbeanRouterState } from "../../state/type";
import { ValidationError, ValidationResult } from "joi";
import { logger } from "../../logger";
import { flash, FlashOptions } from "./flash";


type BangOptions = {
  flashOptions?: FlashOptions;
  redirectTo?: string;
  status?: StatusCodes;
  flash?: Flash;
  locals?: any;
}
/**
 * Renders a template with an error status. By default, it will render a 500 internal server error.
 */
export function bang(ctx: Context, view: string, options?: BangOptions) {
  const defaultOptions: BangOptions = {
    status: StatusCodes.INTERNAL_SERVER_ERROR
  }

  // final options
  const opts = {...defaultOptions, ...(options || {})}

  // if the message was not set manually, then set it automatically
  if (opts.flash === undefined) {
    const reasonPhrase = opts.status ? getReasonPhrase(opts.status) : getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
    opts.flash = { error: reasonPhrase }
  }

  if (opts.redirectTo) {
    // redirect

    flash(ctx, opts.flash, { persistent: true });
    return ctx.redirect(opts.redirectTo);
  } else {
  // render

  if (opts.status) {
    ctx.status = opts.status;
  }
  flash(ctx, opts.flash, opts.flashOptions);
  return ctx.render(view, opts.locals);
  }
  


}

export function bangLogError500(ctx: Context, view: string, error: Error | any) {
  logger.error(error);
  return bang(ctx, view);
}

export function bangValidationFailure(ctx: ParameterizedContext<MintbeanRouterState>, view: string, validation: ValidationResult) {
  ctx.state.validationResults = validation;
  return bang(ctx, view, {
    status: StatusCodes.BAD_REQUEST
  })
}

export function bang404(ctx: Context) {
    return bang(ctx, "common/views/404.pug", {
      status: 404
    })
}

export function bangRedirect(ctx: Context, redirectToPath: string, flash: Flash) {
  return bang(ctx, "", {
    redirectTo: redirectToPath,
    flash,
    flashOptions: {
      persistent: true
    }
  })
}