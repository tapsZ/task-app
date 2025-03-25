import { Router, Request, Response } from "express";
import { db } from "../db";
import { NewUser, users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";

const authRouter = Router();

interface SignUpBody {
  name: string;
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

authRouter.get("/", (req, res) => {
  res.send("Hey there! from auth");
});
export default authRouter;
