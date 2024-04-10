import express from "express";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../contants";
import { TokenPayload } from "../types/tokenPayload";

const verifyRouter = express.Router();

verifyRouter.post("/", async (req, res) => {
  if (!res.locals.isUserLoggedIn) return res.status(401).send("Unauthorized");
  const tokenPayload: TokenPayload = {
    username: res.locals.username,
  };

  return res.status(200).json({
    token: sign(tokenPayload, JWT_SECRET, {
      expiresIn: "4h",
    }),
  });
});

export default verifyRouter;
