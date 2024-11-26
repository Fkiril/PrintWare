import { Router } from "express";
const router = Router();

import { uploadDoc, deleteDoc, takeDocList, getDoc, createPrintTask, checkFile } from "../../controllers/web_controllers/DocumentController.js";

import multer from "multer";
const upload = multer({ dest: "uploads/" });

router.post("/uploadDoc", upload.single("file"), uploadDoc);
router.delete("/deleteDoc", deleteDoc);
router.get("/takeDocList", takeDocList);
router.get("/getDoc", getDoc);
router.post("/printTask", createPrintTask);
router.post("/checkFile", checkFile);

export default router;