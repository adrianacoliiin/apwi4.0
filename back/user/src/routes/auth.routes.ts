import express, { Router } from "express";
import { deleteUser, updateUser,loginMethod, getTimeToken, verifyToken, updateToken, getAllUsersByEmail, getAllUsers, saveUser } from "../controllers/auth.controller";

const router = Router();

router.post('/login-user', loginMethod);
router.get('/token/:userId', getTimeToken);
router.get('/verify-token/:token', verifyToken);
router.put('/update/:userId', updateToken);
router.get('/users', getAllUsers);
router.get('/users/find/email/:userEmail', getAllUsersByEmail);
router.post('/users', saveUser);
router.delete('/users/delete/:userId', deleteUser);
router.put('/users/update/:userId', updateUser);

export default router;