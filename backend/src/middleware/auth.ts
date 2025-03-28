import { UUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import jwt from "jsonwebtoken";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export interface AuthRequest extends Request {
  user?: UUID;
  token?: string;
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      res.status(401).json({ error: "No auth token, access denied!" });
      return;
    }
    const verified = jwt.verify(token, "password_key");

    if (!verified) {
      res.status(401).json({ error: "Token verification failed!" });
      return;
    }

    const verifiedToken = verified as { id: UUID };
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, verifiedToken.id));

    if (!user) {
      res.status(401).json({ error: "User not found!" });
      return;
    }
    req.user = verifiedToken.id;
    req.token = token;
    next();
  } catch (e) {
    res.status(500).json(false);
  }
};
