import express from "express";
import { prisma } from "../index.js";

export const postsRouter = express.Router();

// Read all posts
postsRouter.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { user: true, subreddit: true, upvotes: true, downvotes: true },
    });
    res.send({ success: true, posts });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});
