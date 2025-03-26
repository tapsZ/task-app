import { Router, Request, Response } from "express";
import { db } from "../db";
import { NewUser, users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const authRouter = Router();
interface SignUpBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

authRouter.post(
  "/signup",
  async (req: Request<{}, {}, SignUpBody>, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      if (existingUser.length) {
        res
          .status(400)
          .json({ error: "User with the same Email already exists" });
        return;
      }

      const hashedPassowrd = await bcryptjs.hash(password, 8);
      const newUser: NewUser = { name, email, password: hashedPassowrd };
      const [user] = await db.insert(users).values(newUser).returning();
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

authRouter.post(
  "/login",
  async (req: Request<{}, {}, LoginBody>, res: Response) => {
    try {
      const { email, password } = req.body;
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!existingUser) {
        res.status(400).json({ error: "User does not exists" });
        return;
      }

      const isMatch = await bcryptjs.compare(password, existingUser.password);
      if (!isMatch) {
        res.status(400).json({ error: "Incorrect Password!" });
        return;
      }
      console.log(process.env.JWT_KEY);
      const token = jwt.sign({ id: existingUser.id }, "password_key");

      res.status(200).json({ token, ...existingUser });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      res.json(false);
      return;
    }
    const verified = jwt.verify(token, "password_key");

    if (!verified) {
      res.json(false);
      return;
    }

    const verifiedToken = verified as { id: string };
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, verifiedToken.id));

    if (!user) {
      res.json(false);
      return;
    }
    res.json(true);
  } catch (e) {
    res.json(false);
  }
});

authRouter.get("/", (req, res) => {
  res.send("Hey there! from auth");
});
export default authRouter;
