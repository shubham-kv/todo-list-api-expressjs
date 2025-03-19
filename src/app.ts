import express from "express";
import morgan from "morgan";
import { debugHttp } from "./constants";

const app = express();
const morganStream: morgan.StreamOptions = {
  write(str) {
    debugHttp(str.trim());
  },
};

app.use(morgan("dev", { stream: morganStream }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Hello World" });
});

export { app };
