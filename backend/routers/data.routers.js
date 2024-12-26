import { Router } from "express";
import { addData, getAllData } from "../controllers/data.controllers.js";

const router = Router();

router.route("/add").post(addData);
router.get('/get-all', getAllData);

export default router;