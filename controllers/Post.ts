import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const writePost = async (req: Request, res: Response) => {
  try {
    const { title, body } = req.body;
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const tagPost = async (req: Request, res: Response) => {
  try {
    const { tag } = req.params;

    const posts = await prisma.post.findMany({
      where: {
        categories: {
          some: {
            name: tag,
          },
        },
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            profile: {
              select: {
                about: true,
                avatar: true,
              },
            },
          },
        },
        likes: true,
        comments: true,
      },
    });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    return res.status(200).json({ post });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.findMany();

    return res.status(200).json({ post });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
