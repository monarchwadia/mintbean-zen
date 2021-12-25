const Koa = require('koa');
const Pug = require("koa-pug")
var KoaRouter = require('koa-router')
const path = require("path");
const { getChallenges } = require('./data/challenge');
const serve = require("koa-static");

const app = new Koa();
app.use(serve(path.resolve(__dirname, "./static")))

// this is weird, but it's how Pug initializes stuff.
new Pug({
  viewPath: path.resolve(__dirname, "./views"),
  app
})

const r = (name, router) => {
  const handler = async (ctx) => await ctx.render(name);
  const route = `/${name};`
  
  router.get(route, handler)
}

const router = new KoaRouter();

["about", "discord", "employers", "guide", "layout", "about", "login"].forEach(route => {
  router.get(`/${route}`, async (ctx) => await ctx.render(route))
});

router.get("/", async (ctx) => await ctx.render("index", {challenges: await getChallenges()}))

app.use(router.routes());

app.listen(3000);
