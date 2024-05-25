import Knex from "knex";
import multer from "multer";
import express, { Request, Response, NextFunction } from 'express';
import knexConfig from "../../knexfile.js";
import { deleteFile, uploadFile } from "../utils/minio.js";
import { jwtAuth } from "../utils/jwt.js";

const knex = Knex(knexConfig.development);
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", jwtAuth(), async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.user);
  const userTodos = await knex("todos").select("*").where({ user_id: req.user!.id });
  const todosWithTags = await Promise.all(userTodos.map(async (todo) => {
    const tags = await knex("tags").select("id", "tag").where({ todo_id: todo.id })
    return {
      ...todo,
      tags
    }
  }))
  res.json(todosWithTags);
})

router.post("/", jwtAuth(), upload.fields([{ name: 'image' }, { name: 'file' }]), async (req: Request, res: Response, next: NextFunction) => {
    const { title, comment } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imageFile = files && files['image'] ? files['image'][0] : null;
    const imageName = imageFile ? `${req.user!.id}/${imageFile.originalname}` : null;

    const otherFile = files && files['file'] ? files['file'][0] : null;
    const fileName = otherFile ? `${req.user!.id}/${otherFile.originalname}` : null;
  
    try {
      if (imageFile && imageName) {
        await uploadFile({ data: imageFile.buffer }, imageName);
      }
      if (otherFile && fileName) {
        await uploadFile({ data: otherFile.buffer }, fileName);
      }

      await knex("todos")
          .insert({
            user_id: req.user!.id,
            title,
            comment,
            image_link: imageName,
            file_link: fileName
          })
  
      res.status(201).send('To-Do created successfully!');
    } catch (error) {
      next(error);
    }
  });

router.post("/delete", jwtAuth(), async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body;
  try {
    const userTodo = await knex("todos").select("*").where({ id }).first();
    if (userTodo.image_link) {
      await deleteFile(userTodo.image_link)
    }
    if (userTodo.file_link) {
      await deleteFile(userTodo.file_link)
    }
    await knex("todos").where({ id }).delete()
    res.status(200).send("Todo deleted successfully")
  } catch (error) {
    next(error);
  }
})

export default router;