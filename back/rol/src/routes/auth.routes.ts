import express, { Router } from "express";
import { saveRol } from "../controllers/auth.controller";

import {
  getMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
} from '../controllers/menu.controller';

const router = Router();

router.post('/rol', saveRol);

router.get('/menu', getMenus);
router.get('/menu/:id', getMenuById);
router.post('/menu', createMenu);
router.put('/menu/:id', updateMenu);
router.delete('/menu/:id', deleteMenu);

export default router;