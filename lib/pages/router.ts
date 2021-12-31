import KoaRouter from "koa-router"
import { MintbeanRouterState } from "../state/type";
import fs from "fs";
import path from "path";

export const pagesRouter = new KoaRouter<MintbeanRouterState>();

pagesRouter.get("/:splat*", async (ctx, next) => {
  const filepath = path.join(__dirname, "./views", ctx.path + ".pug")

  let exists = false;
  try {
    exists = fs.statSync(filepath).isFile();
  } catch (e) {}
  
  if (exists) {
    return ctx.render(`pages/views/${ctx.path}`);
  } else {
    return next();
  }
})