import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export const refreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  const refreshToken = cookies.jwt;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const accessToken = jwt.sign(
        {
          id: decoded?.id,
          email: decoded?.email,
          username: decoded?.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "10s",
        }
      );

      return res.status(200).json({ accessToken });
    }
  );
};
