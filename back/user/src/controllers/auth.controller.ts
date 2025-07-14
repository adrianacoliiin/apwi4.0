import { Request, response, Response } from 'express';
import { generateAccessToken, isTokenOkey } from '../utils/token';
import { cache } from '../utils/cache';
import dayjs from 'dayjs';
import { User } from '../models/UserModel';
import { json } from 'stream/consumers';
import { sha256, sha224 } from 'js-sha256';
//Tarea verificar que el token, lo haya realizado nosotros

export const loginMethod = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user || user.password !== sha256(password)) {
        return res.status(401).json({ message: "Incorrect username or password" });
    }

    const userId = user._id.toString();
    const accessToken = generateAccessToken(userId);

    // Cache con TTL de 15 minutos
    cache.set(userId, accessToken, 60 * 15);

    return res.status(200).json({
        message: "Login successful",
        accessToken
    });
};

export const getTimeToken = (req: Request, res: Response) => {
    const { userId } = req.params;

    const token = cache.get(userId); // Recuperación de token
    if (!token) {
        return res.status(404).json({
            message: "Token not found",
        });
    }

    // Verificar si el token es válido
    if (!isTokenOkey(token)) {
        return res.status(401).json({
            message: "Token not valid",
        });
    }

    const ttl = cache.getTtl(userId); // Tiempo de vida
    if (!ttl) {
        return res.status(404).json({
            message: "Token TTL not found",
        });
    }

    const now = Date.now();
    const timeToLife = Math.floor((ttl - now) / 1000); // Segundos
    const expTime = dayjs(ttl).format('HH:mm:ss'); // Formato de fecha

    return res.status(200).json({
        timeToLife,
        expTime
    });
};

export const verifyToken = (req: Request, res: Response) => {
    const { token } = req.params;

    if (!isTokenOkey(token)) {
        return res.status(401).json({
            message: "Token not valid",
        });
    }

    return res.status(200).json({
        message: "Token valid",
    });
};

export const updateToken = (req: Request, res: Response) => {
    const { userId } = req.params;

    // Obtener el TTL actual del token desde la caché
    const ttl = cache.getTtl(userId);
    if (!ttl) {
        return res.status(404).json({
            message: "Token TTL not found",
        });
    }

    // Establecer un nuevo TTL (15 minutos más)
    const newTimeToken: number = 60 * 15; // 15 minutos en segundos

    // Actualizar el TTL del token
    cache.ttl(userId, newTimeToken);

    // Responder al cliente
    return res.status(200).json({
        message: "Token updated",
    });
};

export const getAllUsers = async (req: Request, res: Response) => {
    const userList = await User.find();
    return res.json({ userList });
}

export const getAllUsersByEmail = async (req: Request, res: Response) => {
    const { userEmail } = req.params;
    
    const serch = new RegExp(userEmail, 'i'); // 'i' search case insensitive

    const userListByEmail = await User.find({ email: serch });
    return res.json({ userListByEmail });
}

// CREAR USUARIO
export const saveUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role, firstName, lastName } = req.body;

        const pass = sha256(password);

        // Normalizar roles: asegurar que sean objetos con type y name
        const rolesArray = Array.isArray(role) ? role : [role];
        const formattedRoles = rolesArray.map((r) => {
            if (typeof r === 'string') {
                return { type: r, name: r }; // si solo te mandan 'admin', lo convertimos a {type: 'admin', name: 'admin'}
            } else if (typeof r === 'object' && r.type && r.name) {
                return r;
            } else {
                throw new Error("Formato de rol inválido");
            }
        });

        const newUser = new User({
            firstName,
            lastName,
            username,
            password: pass,
            role: formattedRoles,
            email
        });

        const userSaved = await newUser.save();
        return res.status(201).json({
            message: "User created successfully",
            user: userSaved
        });
    } catch (error: any) {
        return res.status(400).json({ message: error.message || "Error creating user" });
    }
};

// ACTUALIZAR USUARIO
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { username, email, password, role, firstName, lastName } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userEmail = await User.findOne({ email });
        if (userEmail && userEmail.id !== user.id) {
            return res.status(426).json({ message: "El correo ya existe" });
        }

        if (password != null) user.password = sha256(password);
        if (email != null) user.email = email;
        if (username != null) user.username = username;
        if (firstName != null) user.firstName = firstName;
        if (lastName != null) user.lastName = lastName;

        if (role != null) {
            const rolesArray = Array.isArray(role) ? role : [role];
            user.role = rolesArray.map((r) => {
                if (typeof r === 'string') {
                    return { type: r, name: r };
                } else if (typeof r === 'object' && r.type && r.name) {
                    return r;
                } else {
                    throw new Error("Formato de rol inválido");
                }
            });
        }

        const updatedUser = await user.save();
        return res.json({ updatedUser });
    } catch (error: any) {
        return res.status(400).json({ message: error.message || "Error updating user" });
    }
};

export const deleteUser=async(req: Request,res: Response) => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user){
        return res.status(404).json({ message: "User not found"});
    }

    user.status=false;
    user.deleteDate= new Date;

    const deleteUser = await user.save();
    return res.json({ deleteUser });
}