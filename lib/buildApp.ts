import Koa, { DefaultState } from 'koa';
import Pug from "koa-pug";
import path from "path";
import mount from 'koa-mount';
import { pageRouter } from '../lib/page/router';
import { challengeRouter } from '../lib/challenge/router';
import { authRouter } from '../lib/auth/router';
import { staticMiddleware } from '../lib/static/middleware';
import { setUserMiddleware } from './state/middleware';


export const buildApp = () => {
  const app = new Koa<DefaultState>();

  // Pug templating engine
  const pugBasePath = path.join(__dirname, "../lib");
  new Pug({
    app, 
    viewPath: pugBasePath, 
    basedir: pugBasePath,
  });
  
  // set the user in ctx.state
  app.use(setUserMiddleware);
  
  app.use(mount("/", pageRouter.routes()));
  app.use(mount("/static", staticMiddleware));
  app.use(mount("/auth", authRouter.routes()));
  app.use(mount("/challenge", challengeRouter.routes()));

  return app;
}


