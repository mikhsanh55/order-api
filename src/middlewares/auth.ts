import {Request, Response, NextFunction} from "express";
import jwt from 'jsonwebtoken';

// allowing request to have user property
interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!); // using ! to tell typescript res assure the porcess.env.JWT_SECRET has value
        req.user = decoded;

        next();
    }
    catch(err) {
        res.status(500).json({
            message: 'Invalid token'
        });
    }

};