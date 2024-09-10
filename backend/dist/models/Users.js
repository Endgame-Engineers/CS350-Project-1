"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConnectToDB_1 = __importDefault(require("../utils/ConnectToDB"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class Users {
    constructor() {
        this.client = new ConnectToDB_1.default().connect();
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (yield this.client).query('SELECT * FROM "Users"');
            return result.rows;
        });
    }
    getUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (yield this.client).query('SELECT * FROM "Users" WHERE username = $1', [username]);
            return result.rows[0];
        });
    }
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (yield this.client).query('INSERT INTO "Users" (username, email, firstname, lastname, uuid, last_login) VALUES ($1, $2, $3, $4, $5, $6)', [user.username, user.email, user.firstname, user.lastname, user.uuid, user.last_login]);
        });
    }
    updateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (yield this.client).query('UPDATE "Users" SET email = $1, firstname = $2, lastname = $3, uuid = $4, last_login = $5 WHERE username = $6', [user.email, user.firstname, user.lastname, user.uuid, user.last_login, user.username]);
        });
    }
    deleteUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (yield this.client).query('DELETE FROM "Users" WHERE username = $1', [username]);
        });
    }
    close() {
        ConnectToDB_1.default.close(this.client);
    }
}
exports.default = Users;
