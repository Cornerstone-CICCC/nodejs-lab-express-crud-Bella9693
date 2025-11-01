"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3500;
app.use(express_1.default.json()); // JSON 허용
app.use((0, cors_1.default)()); // CORS 허용
let employees = [];
// Routes
app.get("/employees", (req, res) => {
    res.json(employees);
});
app.get("/employees/:id", (req, res) => {
    const emp = employees.find((e) => e.id === req.params.id);
    if (!emp)
        return res.status(404).json({ message: "Employee not found" });
    res.json(emp);
});
app.post("/employees", (req, res) => {
    const { firstname, lastname, age, isMarried } = req.body;
    const newEmployee = {
        id: (0, uuid_1.v4)(),
        firstname,
        lastname,
        age,
        isMarried,
    };
    employees.push(newEmployee);
    res.status(201).json(newEmployee);
});
app.put("/employees/:id", (req, res) => {
    const index = employees.findIndex((e) => e.id === req.params.id);
    if (index === -1)
        return res.status(404).json({ message: "Employee not found" });
    employees[index] = Object.assign(Object.assign({}, employees[index]), req.body);
    res.json(employees[index]);
});
app.delete("/employees/:id", (req, res) => {
    const index = employees.findIndex((e) => e.id === req.params.id);
    if (index === -1)
        return res.status(404).json({ message: "Employee not found" });
    const deleted = employees.splice(index, 1);
    res.json(deleted[0]);
});
app.get("/employees/search", (req, res) => {
    var _a;
    const firstname = ((_a = req.query.firstname) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase()) || "";
    const filtered = employees.filter((e) => e.firstname.toLowerCase().includes(firstname));
    res.json(filtered);
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
