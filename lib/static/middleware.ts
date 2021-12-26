import serve from "koa-static";
import path from "path";

export const staticMiddleware = serve(path.resolve(__dirname, "./assets"));
