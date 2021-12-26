import Koa from 'koa';
import Pug from "koa-pug";
import KoaRouter from "koa-router"
import path from "path";
import { getChallengeBy, getChallenges } from './lib/challenge/dao';
import serve from "koa-static";
import mount from 'koa-mount';
import { pageRouter } from './lib/page/router';
import { challengeRouter } from './lib/challenge/router';
import { authRouter } from './lib/auth/router';

const app = new Koa();

// static assets
app.use(mount("/static", serve(path.resolve(__dirname, "./static"))));

// Pug templating engine
// this is weird, but it's how Pug initializes stuff.
const pugBasePath = path.join(__dirname, "./lib");
new Pug({
  app, 
  viewPath: pugBasePath, 
  basedir: pugBasePath
})

// main router
const router = new KoaRouter();

// register the routes
app.use(router.routes());

app.use(mount("/", pageRouter.routes()));
app.use(mount("/challenge", challengeRouter.routes()));
app.use(mount("/auth", authRouter.routes()));

app.listen(3000);
