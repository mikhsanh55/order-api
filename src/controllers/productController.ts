import { Request, Response } from "express";
import Product from '../models/Product';
import { Op } from "sequelize";
import { ParsedQs } from "qs";

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