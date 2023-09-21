import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import { postsRouter } from "./routes/postsRouter.js";
import { usersRouter } from "./routes/usersRouter.js";
import { subredditsRouter } from "./routes/subredditsRouter.js";

dotenv.config();

const app = express();
export const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// Middleware to auth tokens

app.use(async (req, res, next) => {
  // check if theres an auth token in header and console it
  try {
    if (!req.headers.authorization) {
      return next();
    }

    const token = req.headers.authorization.split(" ")[1];

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return next();
    }
    delete user.password;
    req.user = user;
    next();
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

app.use("/posts", postsRouter);
app.use("/users", usersRouter);
app.use("/subreddits", subredditsRouter);

// Welcome
app.get("/", (req, res) => {
  res.send({ success: true, message: "Welcome to the Post-it server " });
});

app.use((req, res) => {
  res.send({ success: false, error: "No route found." });
});

app.use((error, req, res, next) => {
  res.send({ success: false, error: error.message });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
