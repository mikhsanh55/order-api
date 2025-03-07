import { Request, Response } from "express";
import Order from '../models/Order';
import { Op } from "sequelize";
import { ParsedQs } from "qs";

/**
 * Get list order
 * 
 * @return json
 */
export const orderIndex = async (req: Request, res: Response) => {
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
                { customerName: { [Op.iLike]: `%${searchValue}%` } }, // case-insensitive
                { status: { [Op.iLike]: `%${searchValue}%` } }
            ]
        } : {};

        // get total records count
        const totalRecords = await Order.count();

        // Get filtered records count
        const filteredRecords = await Order.count({ where: whereCondition });

        const orders = await Order.findAll({
            where: whereCondition,
            offset: start,
            limit: length
        });

        res.json({
            draw: draw,
            recordsTotal: totalRecords,
            recordsFiltered: filteredRecords,
            data: orders,
        });
    }
    catch(error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
};

/**
 * Get order by id
 * 
 * @return json
 */
export const orderShow = async (req: Request<{ id: string }>, res: Response) => {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
        res.status(400).json({ message: 'Order not found' });
        return;
    }

    res.json(order);
};

/**
 * Store order
 * 
 * @return json
 */
export const orderStore = async (req: Request, res: Response) => {
    try {
        const {
            customerName, totalAmount, status, note, items
        } = req.body;

        const newOrder = await Order.create({
            customerName,
            totalAmount,
            status,
            note: note ?? null,
            items: items ?? null
        });

        res.status(201).json(newOrder);
    }
    catch(error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
};

/**
 * Update order
 * 
 * @return json
 */
export const orderUpdate = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const {id} = req.params;
        const order = await Order.findByPk(id);
        if(!order) {
            res.status(404).json({
                message: 'Order not found'
            });
            return;
        }

        await order.update({
            ...req.body,
            note: req.body.note ?? order.note,
            items: req.body.items ?? order.items
        });

        res.status(200).json(order);
    }
    catch(error) {
        res.status(500).json({ message: "Error updating order", error });
    }
};

/**
 * Delete order
 * 
 * @return json
 */
export const orderDestroy = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id);

        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        await order.destroy();
        res.json({ message: "Order deleted successfully" });
    }
    catch(error) {
        res.status(500).json({ message: "Error updating order", error });
    }
};