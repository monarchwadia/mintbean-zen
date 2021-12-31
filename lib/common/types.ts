import session from "koa-session";
import { Flash } from "../state/type";

export interface MintbeanSession extends session.Session {
  currentUserId?: string;
  flash?: Flash;
}