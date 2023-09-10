import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import UserRoute from "../routes/UserRoute";

const app = express();
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.json());

app.use("/api/v1", UserRoute);

const server = http.createServer(app);

server.listen(8080, () => console.log("Server is running on port 8080"));
