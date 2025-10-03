import { Router } from "express";
import * as employee from "../controllers/employee.controller";

const router = Router();

router.get("/", employee.getEmployee);
router.post("/", employee.createEmployee);
router.put("/", employee.updateEmployee);
router.delete("/", employee.deleteEmployee);

export default router;
