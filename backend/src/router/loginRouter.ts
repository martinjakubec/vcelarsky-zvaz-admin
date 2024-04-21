import express from "express";
import { TokenExpiredError, sign, verify } from "jsonwebtoken";
import { JWT_SECRET } from "../constants";
import prismaClient from "../prismaClient";
import { compare } from "bcrypt";
import { TokenPayload } from "../types/tokenPayload";

const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;
  if (!username) return res.status(400).send("Username is required");
  if (!password) return res.status(400).send("Password is required");
  try {
    const user = await prismaClient.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) return res.status(401).send("Invalid username or password");

    if (!(await compare(password, user.password)))
      return res.status(401).send("Invalid username or password");

    const tokenPayload: TokenPayload = {
      username,
    };

    return res.status(200).json({
      token: sign(tokenPayload, JWT_SECRET, {
        expiresIn: "4h",
      }),
    });
  } catch (error) {
    console.log(error);

    if (error instanceof TokenExpiredError) {
      return res.status(401).send("Token expired");
    }
    return res.status(500).send("Something went wrong");
  }
});

export default loginRouter;
