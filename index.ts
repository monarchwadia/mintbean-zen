import Koa from 'koa';
import Pug from "koa-pug";
import KoaRouter from "koa-router"
import path from "path";
import { getChallenges } from './data/challenge';
import serve from "koa-static";

const app = new Koa();
app.use(serve(path.resolve(__dirname, "./static")))

// this is weird, but it's how Pug initializes stuff.
new Pug({
  viewPath: path.resolve(__dirname, "./views"),
  app
})
const router = new KoaRouter();

["about", "discord", "employers", "guide", "layout", "about", "login"].forEach(route => {
  router.get(`/${route}`, async (ctx) => await ctx.render(route))
});

router.get("/", async (ctx) => await ctx.render("index", {challenges: await getChallenges()}))

app.use(router.routes());

app.listen(3000);
