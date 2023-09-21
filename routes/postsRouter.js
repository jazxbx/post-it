import express from "express";
import { prisma } from "../index.js";

export const postsRouter = express.Router();

//READ ALL POSTS  GET REQ   route: /posts

postsRouter.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { user: true, subreddit: true, upvotes: true, downvotes: true },
    });
    if (posts.length === 0) {
      res.send({ success: false, message: "No posts found in database" });
    } else {
      res.send({ success: true, posts });
    }
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

//CREATE POST   POST REQ  route: /posts

postsRouter.post("/", async (req, res) => {
  try {
    const { text, title, subredditId } = req.body;
    if (!text || !title) {
      return res.send({
        success: false,
        error: "Please include both text and title when creating a post.",
      });
    }

    if (!req.user) {
      return res.send({
        success: false,
        error: "Please login to submit post.",
      });
    }

    // console.log(req.user);
    const posts = await prisma.post.create({
      data: {
        text,
        title,
        subredditId: subredditId,
        userId: req.user.id,
      },
    });
    res.send({ success: true, posts });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

// EDIT POST  PUT REQ   route: /posts/postId

postsRouter.put("/:postId", (req, res) => {
  try {
    const { postId } = req.params;
    const { title, text } = req.body;
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});
