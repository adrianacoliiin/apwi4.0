import jwt from 'jsonwebtoken';
import { cache } from './cache';

const ACCESS_SECRET = "secret124utd";

export const generateAccessToken = (userId: string) => {
    return jwt.sign(
            { userId },
            ACCESS_SECRET,
            { expiresIn: '15m' } // Corrección: era "expireIn"
        );
} 

export const isTokenOkey = (token: string): boolean => {
    try {
        jwt.verify(token, ACCESS_SECRET);
        return true;
    } catch (error) {
        return false;
    }
};

export const updateToken = (userId: string) => {
    // Establecer un nuevo TTL (15 minutos más)
    const newTimeToken: number = 60 * 15; // 15 minutos en segundos
    
    // Actualizar el TTL del token
    cache.ttl(userId, newTimeToken);
}