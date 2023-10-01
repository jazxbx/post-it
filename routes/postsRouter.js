import express from "express";
import { prisma } from "../index.js";

export const postsRouter = express.Router();

//READ ALL POSTS  GET REQ   route: /posts

// postsRouter.get("/", async (req, res) => {
//   try {
//     const posts = await prisma.post.findMany({
//       include: { user: true, subreddit: true, upvotes: true, downvotes: true },
//     });
//     if (posts.length === 0) {
//       res.send({ success: false, message: "No posts found in database" });
//     } else {
//       res.send({ success: true, posts });
//     }
//   } catch (error) {
//     res.send({ success: false, error: error.message });
//   }
// });

//Get post

postsRouter.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: true,
        children: true,
        subreddit: true,
        upvotes: true,
        downvotes: true,
      },
    });

    res.send({ success: true, post: post });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

//READ ALL POSTS WITH CHILDREN

postsRouter.get("/", async (req, res) => {
  try {
    const nestPostsRecursively = (allPosts, parentId = null) => {
      const nestedPosts = [];

      for (const post of allPosts) {
        if (post.parentId === parentId) {
          const children = nestPostsRecursively(allPosts, post.id);
          if (children.length > 0) {
            post.children = children;
          }
          nestedPosts.push(post);
        }
      }
      return nestedPosts;
    };

    const posts = await prisma.post.findMany({
      include: {
        user: true,
        children: true,
        subreddit: true,
        upvotes: true,
        downvotes: true,
      },
    });

    const nestedPosts = nestPostsRecursively(posts);
    res.send({ success: true, posts: nestedPosts });
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
    const post = await prisma.post.create({
      data: {
        text,
        title,
        subredditId: subredditId,
        userId: req.user.id,
      },
    });
    res.send({ success: true, post });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

// EDIT POST  PUT REQ   route: /posts/postId
postsRouter.put("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, title } = req.body;

    // look for post
    const findPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    console.log(findPost);

    if (!findPost) {
      return res.send({
        success: false,
        error: "Post not found!",
      });
    }
    // check if creator of post matches with user requesting to edit post
    if (findPost.userId !== req.user.id) {
      return res.send({
        success: false,
        error: "User unauthorized to edit post",
      });
    }
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        text,
        title,
        userId: req.user.id,
      },
    });

    res.send({ success: true, post });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

// DELETE POST   DELETE RQ  path: /posts/:postId

postsRouter.delete("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    // look for post
    const findPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    console.log("URL", findPost);

    if (!findPost) {
      return res.send({
        success: false,
        error: "Post not found!",
      });
    }
    // check if creator of post matches with user requesting to edit post
    if (findPost.userId !== req.user.id) {
      return res.send({
        success: false,
        error: "User unauthorized to delete post",
      });
    }
    const post = await prisma.post.delete({
      where: { id: postId },
    });

    res.send({ success: true, post });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});
