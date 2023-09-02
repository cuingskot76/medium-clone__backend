import express from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const checkEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (checkEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(503).json({ message: "Internal server error" });
  }
};
