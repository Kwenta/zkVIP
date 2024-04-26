// @ts-nocheck
import { server } from "./server/index";
import * as dotenv from "dotenv";
dotenv.config();

BigInt.prototype.toJSON = function () {
  return this.toString();
};

server;
