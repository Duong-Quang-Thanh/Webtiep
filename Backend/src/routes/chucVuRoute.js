import { Router } from "express";
import * as chucVuController from "../controllers/chucVuController.js";

const router = Router();

router.get("/", chucVuController.getAll);
router.get("/:ma_chuc_vu", chucVuController.getById);
router.post("/", chucVuController.create);
router.put("/:ma_chuc_vu", chucVuController.update);
router.delete("/:ma_chuc_vu", chucVuController.remove);

export default router;