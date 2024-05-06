import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import apiRouter from "./router/apiRouter";
import authMiddleware from "./middleware/authMiddleware";
import { debug } from "./utils/debug";
import cors from "cors";
import { requestIdMiddleware } from "./middleware/requestTimeMiddleware";
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(authMiddleware);
app.use(requestIdMiddleware);
app.use(debug);

app.use("/api", apiRouter);

app.use(
  "/",
  express.static(path.join(__dirname, "..", "..", "frontend", "dist"))
);
app.use(
  "*",
  express.static(path.join(__dirname, "..", "..", "frontend", "dist"))
);

app.listen(3000, () => {
  console.log("listening on port 3000");
});
