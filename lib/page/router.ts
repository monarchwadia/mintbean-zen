import KoaRouter from "koa-router"
import { getChallenges } from "../challenge/dao";

export const pageRouter = new KoaRouter();

const r = (route: string, viewPath: string) => {
  pageRouter.get(route, async (ctx) => await ctx.render(viewPath))
}

r("/about", "page/views/about");
r("/discord", "page/views/discord");
r("/employers", "page/views/employers");
r("/guide", "page/views/guide");
r("/about", "page/views/about");

// root route
pageRouter.get("/", async (ctx) => await ctx.render("page/views/index", {challenges: await getChallenges()}))

// ["about", "discord", "employers", "guide", "layout", "about", "auth/login"].forEach(route => {
//   router.get(`/${route}`, async (ctx) => await ctx.render(route))
// });