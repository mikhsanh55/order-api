import { Request, Response } from "express";
import Product from '../models/Product';
import { Op } from "sequelize";
import { ParsedQs } from "qs";
import fs from 'fs';
import path from 'path';

interface ProductInterface {
    name: string;
    description: string;
    price: number;
    image: null | string;
}

/**
 * Get list all product
 * 
 * @return json
 */
export const productIndex = async (req: Request, res: Response) => {
    try {
        // extract datatable parameters
        const draw = parseInt(req.query?.draw as string) || 1;
        const start = parseInt(req.query?.start as string) || 0;
        const length = parseInt(req.query?.length as string) || 10;
        const searchParam = req.query.search;
        let searchValue: string | undefined;

        if (typeof searchParam === "object" && searchParam !== null && "value" in searchParam) {
            searchValue = (searchParam as ParsedQs).value as string | undefined;
        } else {
            searchValue = undefined;
        }

        // Filtering condition (if search value exists)
        const whereCondition = searchValue ? {
            [Op.or]: [
                { name: { [Op.iLike]: `%${searchValue}%` } }, // case-insensitive
                { description: { [Op.iLike]: `%${searchValue}%` } }
            ]
        } : {};

        // get total records count
        const totalRecords = await Product.count();

        // Get filtered records count
        const filteredRecords = await Product.count({ where: whereCondition });

        const products = await Product.findAll({
            where: whereCondition,
            offset: start,
            limit: length
        });

        res.json({
            draw: draw,
            recordsTotal: totalRecords,
            recordsFiltered: filteredRecords,
            data: products,
        });
    }
    catch(err) {
        res.status(500).json({
            message: "Error when fetching product data: ",
            error: err
        });
    }
};

/**
 * Get product by id
 * 
 * @return json
 */
export const productShow = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if(!product) {
            res.status(400).json({ message: 'Product not found' });
            return;
        }

        res.json(product);
    }
    catch(err) {
        res.status(500).json({
            message: "Error when fetching product data: ",
            error: err
        });
    }
};

/**
 * Create product
 * 
 * @return json
 */
export const productStore = async (req: Request, res: Response) => {
    try {
        const { name, description, price } = req.body;
        const payload: ProductInterface = {
            name, description, price, image: req.file ? req.file.filename : null
        };

        const newProduct = await Product.create(payload);

        res.status(201).json(newProduct);
    }
    catch(err) {
        res.status(500).json({
            message: 'Error storing product data', error: err
        });
    }
};

/**
 * Update product
 * 
 * @return json
 */
export const productUpdate = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;

        // Find the existing product
        const product = await Product.findByPk(id);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        let imagePath = product.image;

        if(req.file) {
            // delete old image if exists
            if(product.image) {
                const oldImagePath = path.join(__dirname, '../../public/uploads', product.image);
                if(fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }

            }

            // Assign new image path
            imagePath = req.file.filename;
        }

        await product.update({
            name,
            description,
            price,
            image: imagePath
        });

        res.status(200).json({ message: 'Product updated successfully', product });
    }
    catch(e) {
        res.status(500).json({
            message: 'Error updating product', error: e
        });
    }
};