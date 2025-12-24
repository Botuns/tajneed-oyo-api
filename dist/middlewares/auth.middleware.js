"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = exports.isAdmin = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const api_response_1 = require("../utils/api.response");
const officer_model_1 = require("../models/officer.model");
const isAuthenticated = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json(api_response_1.ApiResponse.error("Unauthorized: Token missing"));
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await officer_model_1.Officer.findById(decoded.id);
        if (!user || user.isDeleted) {
            res
                .status(401)
                .json(api_response_1.ApiResponse.error("Unauthorized: User not found or deleted"));
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json(api_response_1.ApiResponse.error("Unauthorized: Invalid token"));
        return;
    }
};
exports.isAuthenticated = isAuthenticated;
// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
        return;
    }
    res
        .status(403)
        .json(api_response_1.ApiResponse.error("Forbidden: Admins only", undefined, api_response_1.ResponseStatus.ERROR));
    return;
};
exports.isAdmin = isAdmin;
// Middleware to validate incoming requests against a DTO-----
const validateRequest = (Dto) => (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const formattedErrors = Object.fromEntries(Object.entries(errors.mapped()).map(([key, value]) => [key, value.msg]));
        res.status(400).json(api_response_1.ApiResponse.validationError(formattedErrors));
    }
    try {
        const instance = new Dto(req.body);
        next();
    }
    catch (error) {
        res
            .status(400)
            .json(api_response_1.ApiResponse.error("Invalid request data", { error: error.message }));
    }
};
exports.validateRequest = validateRequest;
