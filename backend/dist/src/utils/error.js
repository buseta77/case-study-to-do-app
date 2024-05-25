"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.err = void 0;
const err = (response, status, error) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    return response.status(status).json({ error: errorMessage });
};
exports.err = err;
