"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Users_1 = __importDefault(require("../models/Users"));
const router = (0, express_1.Router)();
class UserRoute {
    constructor() {
        this.getUsers = (req, res) => {
            this.user.getUsers().then((users) => {
                res.json(users);
            });
        };
        this.router = (0, express_1.Router)();
        this.user = new Users_1.default();
        this.router.get('/users', this.getUsers);
    }
}
exports.default = new UserRoute().router;
