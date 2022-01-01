import { Context, ParameterizedContext } from "koa";
import {StatusCodes, getReasonPhrase} from "http-status-codes";
import { Flash, MintbeanRouterState } from "../../state/type";
import { ValidationError, ValidationResult } from "joi";
import { logger } from "../../logger";
import { flash } from "./flash";

type BangOptions = {
  status: StatusCodes;
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
    opts.flash = { error:  getReasonPhrase(opts.status) }
  }

  // render

  ctx.status = opts.status;
  flash(ctx, opts.flash);
  console.log("LOCALS", view, opts.locals)
  return ctx.render(view, opts.locals);
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