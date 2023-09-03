import express from "express";
import http from "http";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";

import UserRoute from "../routes/UserRoute";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api/v1", UserRoute);

const server = http.createServer(app);

server.listen(8080, () => console.log("Server is running on port 8080"));
