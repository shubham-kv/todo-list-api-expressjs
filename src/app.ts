import express from "express";
import morgan from "morgan";
import { notFoundHandler, errorHandler } from "./middlewares";
import { registerRouter } from "./routes";
import { apiV1Prefix, debugHttp } from "./constants";

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

app.use(`${apiV1Prefix}/register`, registerRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
