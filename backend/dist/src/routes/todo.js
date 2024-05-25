"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const multer_1 = __importDefault(require("multer"));
const express_1 = __importDefault(require("express"));
const knexfile_1 = __importDefault(require("../../knexfile"));
const minio_1 = require("../utils/minio");
const jwt_1 = require("../utils/jwt");
const knex = (0, knex_1.default)(knexfile_1.default.development);
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post('/todo', (0, jwt_1.jwtAuth)(), upload.fields([{ name: 'image' }, { name: 'file' }]), async (req, res, next) => {
    const { title, todo, day } = req.body;
    console.log(todo);
    const files = req.files;
    const imageFile = files && files['image'] ? files['image'][0] : null;
    const otherFile = files && files['file'] ? files['file'][0] : null;
    try {
        // Upload files to Minio if present
        if (imageFile) {
            const imageEtag = await (0, minio_1.uploadFile)({ data: imageFile.buffer }, imageFile.originalname);
            console.log('Image uploaded with ETag:', imageEtag);
            console.log('Image uploaded with name:', imageFile.originalname);
        }
        if (otherFile) {
            const fileEtag = await (0, minio_1.uploadFile)({ data: otherFile.buffer }, otherFile.originalname);
            console.log('File uploaded with ETag:', fileEtag);
        }
        // You can save title, todo, isDone, day along with file information in your database
        res.status(201).send('To-Do created successfully!');
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
