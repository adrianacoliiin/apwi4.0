import { Request, response, Response } from 'express';
import { generateAccessToken, isTokenOkey } from '../utils/token';
import { Rol } from '../models/RolModel';

export const saveRol = async (req: Request, res: Response) => {
    const { name, type } = req.body;

    const newrol = new Rol({
        name, 
        type,
    });

    const rolSaved = await newrol.save();
    return res.status(201).json({
        message: "Rol created successfully", Rol: rolSaved})
}
