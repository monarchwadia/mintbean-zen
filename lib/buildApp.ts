import Koa, { DefaultState } from 'koa';
import Pug from "koa-pug";
import path from "path";
import mount from 'koa-mount';
import bodyParser from "koa-bodyparser";
import session from "koa-session";

import { homeRouter } from './home/router';
import { pagesRouter } from './pages/router';
import { challengeRouter } from '../lib/challenge/router';
import { authRouter } from '../lib/auth/router';
import { staticMiddleware } from '../lib/static/middleware';
import { setUserMiddleware } from './state/middleware';
import { adminRouter } from './admin/router';
import { persistentFlashMiddleware } from './common/middleware/persistentFlash.middleware';
import { relativeTimeFromNow } from './common/views/helpers/relativeTimeFromNow';


export const buildApp = () => {
  const app = new Koa<DefaultState>();

  // TODO: set secrets
  app.keys = ['some secret']

  app.use(bodyParser())
  app.use(session({
    maxAge: 90 * 24 * 60 * 60 * 1000,
    rolling: true // reset the cookie on every response
  }, app))

  // Pug templating engine
  const pugBasePath = path.join(__dirname, "../lib");
  new Pug({
    app, 
    viewPath: pugBasePath, 
    basedir: pugBasePath,
    helperPath: [{
      relativeTimeFromNow: relativeTimeFromNow
    }]
  });
  
  app.use(setUserMiddleware);
  app.use(persistentFlashMiddleware);
  
  app.use(mount("/", homeRouter.routes()));
  app.use(mount("/pages", pagesRouter.routes()));
  app.use(mount("/static", staticMiddleware));
  app.use(mount("/auth", authRouter.routes()));
  app.use(mount("/challenge", challengeRouter.routes()));
  app.use(mount("/admin", adminRouter.routes()));

  return app;
}


