"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const index_1 = require("./routes/index");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const routes = (0, index_1.getRoutes)();
routes.forEach((route) => {
    app.use('/api', route);
});
const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
const server = http_1.default.createServer(app);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
