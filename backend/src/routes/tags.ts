import express, { Request, Response, NextFunction } from 'express';
import Knex from "knex";
import knexConfig from "../../knexfile.js";
import { jwtAuth } from "../utils/jwt.js";

const knex = Knex(knexConfig.development);
const router = express.Router();

router.post("/", jwtAuth(), async (req: Request, res: Response, next: NextFunction) => {
  const { todoId, tag } = req.body;
  try {
    await knex("tags").insert({
      todo_id: todoId,
      tag
    })

    res.status(201).send("Todo tag created successfully")
  } catch (error) {
    next(error);
  }
})

router.post("/delete", jwtAuth(), async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body;
  try {
    await knex("tags").where({ id }).delete()
    res.status(200).send("Tag deleted successfully")
  } catch (error) {
    next(error);
  }
})

export default router;