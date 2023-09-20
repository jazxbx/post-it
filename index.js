import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import jwt from "jsonwebtoken";

import { postsRouter } from "./routes/postsRouter.js";

const app = express();
export const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.use("/posts", postsRouter);

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
