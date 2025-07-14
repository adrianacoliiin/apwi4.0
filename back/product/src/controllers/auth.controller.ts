import { Request, response, Response } from 'express';
import { generateAccessToken, isTokenOkey } from '../utils/token';
import { Product } from '../models/ProductModel';

export const createProduct = async (req: Request, res: Response) => {
    const { name, price, Qty, desc } = req.body;

    const newproduct = new Product({
        name,
        price,
        Qty,
        desc,
    });

    const productSaved = await newproduct.save();
    return res.status(201).json({
        message: "Product created successfully", Product: productSaved})
}

export const getProducts = async (req: Request, res: Response) => {
    const products = await Product.find();
    if (products.length === 0) {
        return res.status(404).json({ message: "No products found" });
    }
    return res.status(200).json(products);
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const deletedProduct = await Product.findByIdAndUpdate(
            id,
            { status: false },
            { new: true }
        );

        return res.status(200).json({
            message: "Product deleted successfully",
            product: deletedProduct
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, price, Qty, desc } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, {
        name,
        price,
        Qty,
        desc
    }, { new: true });

    if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct
    });
}