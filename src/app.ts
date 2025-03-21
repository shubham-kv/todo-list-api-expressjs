import express from "express";
import morgan from "morgan";
import { notFoundHandler, errorHandler } from "./middlewares";
import { routesConfig } from "./config";
import { debugHttp } from "./constants";

const app = express();

const morganStream: morgan.StreamOptions = {
  write(str) {
    debugHttp(str.trim());
  },
};

app.disable("x-powered-by");

app.use(morgan("dev", { stream: morganStream }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Hello World" });
});

routesConfig.map((config) => {
  app.use(config.path, ...config.handlers);
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
