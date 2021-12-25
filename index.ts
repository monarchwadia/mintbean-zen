import Koa from 'koa';
import Pug from "koa-pug";
import KoaRouter from "koa-router"
import path from "path";
import { getChallengeBy, getChallenges } from './data/challenge';
import serve from "koa-static";
import mount from 'koa-mount';

const app = new Koa();

// static assets
app.use(mount("/static", serve(path.resolve(__dirname, "./static"))));

// Pug templating engine
// this is weird, but it's how Pug initializes stuff.
new Pug({
  viewPath: path.resolve(__dirname, "./views"),
  app
})

// main router
const router = new KoaRouter();

// static routes
["about", "discord", "employers", "guide", "layout", "about", "auth/login"].forEach(route => {
  router.get(`/${route}`, async (ctx) => await ctx.render(route))
});

// home page
router.get("/", async (ctx) => await ctx.render("index", {challenges: await getChallenges()}))

// challenge routes
router.get("/challenge/new", async (ctx) => await ctx.render("challenge/new"))
router.get("/challenge/:id", async (ctx) => await ctx.render("challenge/view", {challenge: await getChallengeBy({id: ctx.params.id})}))

// register the routes
app.use(router.routes());

app.listen(3000);
