import express from "express";
import { prisma } from "../index.js";

export const votesRouter = express.Router();

// //CREATE UPVOTE   POST REQ  route: /votes/upvote/:postId

votesRouter.post("/upvotes/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.send({ success: false, error: "No post found" });
    }

    //checking if user already liked post. Without this code, prisma will throw unique constraint error. Mej vague tbh
    const existingUpvote = await prisma.upvote.findFirst({
      where: {
        userId: req.user.id,
        postId,
      },
    });

    if (existingUpvote) {
      return res.send({
        success: false,
        error: "User already liked the post.",
      });
    }

    const upvote = await prisma.upvote.create({
      data: {
        userId: req.user.id,
        postId,
      },
    });
    res.send({ success: true, upvote });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

// //REMOVE UPVOTE   DELETE REQ  route: /votes/upvotes/:postId

votesRouter.delete("/upvotes/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.send({ success: false, error: "Invalid postId" });
    }

    const upvote = await prisma.upvote.delete({
      where: {
        userId_postId: { userId: req.user.id, postId },
      },
    });
    res.send({ success: true, upvote });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

// DOWNVOTES

//CREATE DOWNVOTE   POST REQ  route: /votes/downvotes/:postId

votesRouter.post("/downvotes/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.send({ success: false, error: "No post found" });
    }

    const existingDownvote = await prisma.downvote.findFirst({
      where: {
        userId: req.user.id,
        postId,
      },
    });

    if (existingDownvote) {
      return res.send({
        success: false,
        error: "User already downvoted this post",
      });
    }

    const downvote = await prisma.downvote.create({
      data: {
        userId: req.user.id,
        postId,
      },
    });
    res.send({ success: true, downvote });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

//REMOVE DOWNVOTE   DELETE REQ  route: /votes/downvotes/:postId

votesRouter.delete("/downvotes/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.send({ success: false, error: "Invalid postId" });
    }

    const downvote = await prisma.downvote.delete({
      where: {
        userId_postId: { userId: req.user.id, postId },
      },
    });
    res.send({ success: true, downvote });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});
