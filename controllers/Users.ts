import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient, Prisma } from "@prisma/client";
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

    const checkUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (checkUsername) {
      return res.status(409).json({ message: "Username already exists" });
    }

    if (checkEmail) {
      return res.status(422).json({ message: "Email already exists" });
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
        expiresIn: "20s",
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
        expiresIn: "1d",
      }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    const currentUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken,
    };

    return res.status(200).json(currentUser);
  } catch (error) {
    return res.status(503).json({ message: "Internal server error" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findMany({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        email: true,
        followers: true,
        following: true,
        posts: true,
        profile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get my profile after successful login
export const getMyProfilePost = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    // get user token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken: any = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    const userId = decodedToken?.id;

    const user = await prisma.user.findFirst({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        email: true,
        posts: true,
        profile: {
          select: {
            avatar: true,
            banner: true,
            isMember: true,
          },
        },
      },
    });

    // check if the user login is the same as the user profile
    if (userId !== user?.id) {
      return res.status(401).json({ message: "Unauthorized bro" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyProfileAbout = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    // get user token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken: any = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    const userId = decodedToken?.id;

    const user = await prisma.user.findFirst({
      where: {
        username,
      },
      select: {
        id: true,
        following: true,
        profile: {
          select: {
            about: true,
          },
        },
      },
    });

    // check if the user login is the same as the user profile
    if (userId !== user?.id) {
      return res.status(401).json({ message: "Unauthorized bro" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// SETTINGS
export const getMyProfileSettings = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    // get user token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken: any = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    const userId = decodedToken?.id;

    const user = await prisma.user.findFirst({
      where: {
        username,
      },
      select: {
        id: true,
        email: true,
        profile: {
          select: {
            avatar: true,
          },
        },
        username: true,
      },
    });

    // check if the user login is the same as the user profile
    if (userId !== user?.id) {
      return res.status(401).json({ message: "Unauthorized bro" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyProfilePublishing = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        username,
      },
      select: {
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyProfileNotifications = async (
  req: Request,
  res: Response
) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        username,
      },
      select: {
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyProfileMembership = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        username,
      },
      select: {
        email: true,
        profile: {
          select: {
            isMember: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyProfileSecurity = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        username,
      },
      select: {
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
