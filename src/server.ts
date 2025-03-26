import "dotenv/config";
import http from "http";
import app from "./app";
import { initiateDbConnection } from "./utils/db";
import { debugApiServer } from "./constants";

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

interface SysError extends Error {
  syscall?: string;
  code: string;
}

(async function main() {
  await initiateDbConnection();

  const port = normalizePort(process.env.PORT || "3000");
  app.set("port", port);

  const server = http.createServer(app);
  server.listen(port);

  server.on("error", function onError(error: SysError) {
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    switch (error.code) {
      case "EACCES": {
        console.error(bind + " requires elevated privileges");
        process.exit(1);
      }
      case "EADDRINUSE": {
        console.error(bind + " is already in use");
        process.exit(1);
      }
      default:
        throw error;
    }
  });

  server.on("listening", function onListening() {
    const addr = server.address()!;
    const bind =
      typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debugApiServer("Listening on " + bind);
  });
})();
