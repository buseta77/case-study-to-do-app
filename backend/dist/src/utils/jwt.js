"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = exports.jwtAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("./error");
// Middleware to validate JWT token and handle roles
const jwtAuth = () => {
    return (req, res, next) => {
        const token = req.headers["authorization"];
        if (!token || !token.startsWith("Bearer ")) {
            return (0, error_1.err)(res, 401, "Missing or malformed authorization header");
        }
        const actualToken = token.split(" ")[1];
        if (!actualToken) {
            return (0, error_1.err)(res, 401, "Missing authorization token");
        }
        try {
            const data = jsonwebtoken_1.default.verify(actualToken, process.env.SECRET_KEY);
            const newToken = (0, exports.createToken)(data);
            res.setHeader("Authorization", `Bearer ${newToken}`);
            req.user = data; // Note: You may need to extend the Request type to include the user field
            next();
        }
        catch (error) {
            return (0, error_1.err)(res, 401, "Invalid or expired token");
        }
    };
};
exports.jwtAuth = jwtAuth;
// Function to create a new JWT token
const createToken = (data) => {
    try {
        const token = jsonwebtoken_1.default.sign(data, process.env.SECRET_KEY, { expiresIn: "4h" });
        return token;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error while creating JWT token");
    }
};
exports.createToken = createToken;
