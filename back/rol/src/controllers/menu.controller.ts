import { Request, Response } from 'express';
import { Menu, IMenu } from '../models/MenuModel';

// Obtener todos los menús
export const getMenus = async (req: Request, res: Response) => {
  try {
    const menus = await Menu.find().populate('roles', 'name');
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo menús', error });
  }
};

// Obtener menú por ID
export const getMenuById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findById(id).populate('roles', 'name');
    if (!menu) return res.status(404).json({ message: 'Menú no encontrado' });
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo el menú', error });
  }
};

// Crear menú
export const createMenu = async (req: Request, res: Response) => {
  try {
    const { label, path, icon, roles } = req.body;
    const newMenu = new Menu({ label, path, icon, roles });
    const saved = await newMenu.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Error creando menú', error });
  }
};

// Actualizar menú
export const updateMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await Menu.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Menú no encontrado' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando menú', error });
  }
};

// Eliminar menú
export const deleteMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Menu.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Menú no encontrado' });
    res.status(200).json({ message: 'Menú eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando menú', error });
  }
};