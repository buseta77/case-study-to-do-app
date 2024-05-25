import bcrypt from "bcrypt";
import Knex from "knex";
import express from "express";
import { v4 as uuidv4 } from 'uuid';

import { err } from "../utils/error.js";
import { saltRounds } from "../utils/enum.js";
import { createToken } from "../utils/jwt.js";
import knexConfig from "../../knexfile.js";

const knex = Knex(knexConfig.development);
const router = express.Router();

router.post(
  "/signup",
  async (req, res, next) => {
    const {
      email,
      password,
    } = req.body;
    console.log(email)
    try {
      const isUserExists = await knex("users").where({ email }).first();
      if (isUserExists) return err(res, 400, "User already exists");

      const hashedPassword = bcrypt.hashSync(password, saltRounds);
      const id = uuidv4();

      await knex("users").insert({
        id,
        email,
        password: hashedPassword,
      });

      return res.json({ message: "User successfully created" });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return err(res, 400, "Invalid body");

  try {
    const user = await knex("users").where({ email }).first();
    if (!user) return err(res, 400, "Wrong email");

    if (bcrypt.compareSync(password, user.password)) {
      const token = createToken({
        id: user.id,
      });

      return res.json({ token });
    } else {
      return err(res, 400, "Wrong password");
    }
  } catch (error) {
    next(error);
  }
});

export default router;