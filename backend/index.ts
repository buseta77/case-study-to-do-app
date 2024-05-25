import express, { Request, Response, NextFunction, Express } from "express";
import cors from "cors";
import authRouter from "./src/routes/auth.ts";
import todoRouter from "./src/routes/todo.ts";
import tagsRouter from "./src/routes/tags.ts"
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS for all origins
app.use(cors({ origin: "*" }));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: `Unexpected error: ${err.message}` });
});

// Routes
app.use("/auth", authRouter);
app.use("/todo", todoRouter);
app.use("/tag", tagsRouter);

app.get("/", (req: Request, res: Response) => {
  return res.json({ version: "To-Do API 1.0" });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
