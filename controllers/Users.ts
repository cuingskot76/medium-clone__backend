import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
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

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10s",
      }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(503).json({ message: "Internal server error" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        username: true,
      },
    });
    res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
    });
    return res.status(204).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
