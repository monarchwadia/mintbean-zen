import KoaRouter from "koa-router"
import { getChallenges } from "../challenge/dao";
import { adminOnly } from "../common/middleware/adminOnly.middleware";
import { MintbeanRouterState } from "../state/type";

export const adminRouter = new KoaRouter<MintbeanRouterState>();

adminRouter.use(adminOnly)

const r = (route: string, viewPath: string) => {
  adminRouter.get(route, async (ctx) => await ctx.render(viewPath))
}

r("/", "admin/views/index");

