import express from "express";
import { prisma } from "../index.js";

export const subredditsRouter = express.Router();

// CREATE SUBREDDIT  POST REQ  route: /subreddits

subredditsRouter.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.send({ success: false, error: "Invalid subreddit name" });
    }

    if (!req.user) {
      return res.send({
        success: false,
        error: "Login to create a subreddit",
      });
    }

    const subreddit = await prisma.subreddit.create({
      data: {
        name,
        userId: req.user.id,
      },
    });

    res.send({ success: true, subreddit });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

// READ ALL SUBREDDITS  GET REQ  route: /subreddits

subredditsRouter.get("/", async (req, res) => {
  try {
    const subreddits = await prisma.subreddit.findMany();
    res.send({ success: true, subreddits });
  } catch (error) {
    res.send({ success, error: error.message });
  }
});
