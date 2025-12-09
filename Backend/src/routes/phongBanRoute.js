import { Router } from "express";
import * as phongBanController from "../controllers/phongBanController.js";

const router = Router();

router.get("/", phongBanController.getAll);
router.get("/summary", phongBanController.getTongLuongPhongBan);
router.get("/:ma_phong", phongBanController.getById);
router.post("/", phongBanController.create);
router.put("/:ma_phong", phongBanController.update);
router.delete("/:ma_phong", phongBanController.remove);

export default router;