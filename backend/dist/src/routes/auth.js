"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const knex_1 = __importDefault(require("knex"));
const express_1 = __importDefault(require("express"));
const error_1 = require("../utils/error");
const enum_1 = require("../utils/enum");
const jwt_1 = require("../utils/jwt");
const knexfile_1 = __importDefault(require("../../knexfile"));
const knex = (0, knex_1.default)(knexfile_1.default.development);
const router = express_1.default.Router();
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags:
 *       - Auth
 *     name: Sign up
 *     summary: Signs up a new user
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *           required:
 *             - email
 *             - password
 *     responses:
 *       '200':
 *         description: User successfully created
 *       '400':
 *         description: User already exists or Invalid data
 *       '500':
 *         description: Unexpected error
 */
router.post("/signup", async (req, res, next) => {
    const { email, password, } = req.body;
    try {
        const isUserExists = await knex("users").where({ email }).first();
        if (isUserExists)
            return (0, error_1.err)(res, 400, "User already exists");
        const hashedPassword = bcrypt_1.default.hashSync(password, enum_1.saltRounds);
        await knex("users").insert({
            email,
            password: hashedPassword,
        });
        return res.json({ message: "User successfully created" });
    }
    catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logs in a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *           required:
 *             - email
 *             - password
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *       400:
 *         description: Wrong email or password
 *       500:
 *         description: Unexpected error
 */
router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        return (0, error_1.err)(res, 400, "Invalid body");
    try {
        const user = await knex("users").where({ email }).first();
        if (!user)
            return (0, error_1.err)(res, 400, "Wrong email");
        if (bcrypt_1.default.compareSync(password, user.password)) {
            const token = (0, jwt_1.createToken)({
                id: user.id,
            });
            return res.json({ token });
        }
        else {
            return (0, error_1.err)(res, 400, "Wrong password");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
