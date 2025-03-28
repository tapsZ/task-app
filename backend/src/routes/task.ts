import { Router } from "express";
import { auth, AuthRequest } from "../middleware/auth";
import { NewTask, tasks } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

const taskRouter = Router();

taskRouter.post("/", auth, async (req: AuthRequest, res) => {
  try {
    const newTask: NewTask = {
      ...req.body,
      uid: req.user,
      dueAt: new Date(req.body.dueAt),
    };
    const [task] = await db.insert(tasks).values(newTask).returning();
    res.status(201).json(task);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

taskRouter.get("/", auth, async (req: AuthRequest, res) => {
  try {
    const allTask = await db
      .select()
      .from(tasks)
      .where(eq(tasks.uid, req.user!));
    res.json(allTask);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

taskRouter.delete("/", auth, async (req: AuthRequest, res) => {
  try {
    const { taskId }: { taskId: string } = req.body;
    await db.delete(tasks).where(eq(tasks.id, taskId));
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
export default taskRouter;
