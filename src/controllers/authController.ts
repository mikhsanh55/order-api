import { Request, Response } from "express";
import User from '../models/User';
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

/**
 * register user
 * 
 * @return json
 */
export const authRegister = async (req: Request, res: Response) => {
    try {
        const {name, email, password} = req.body;

        // check emaiil uniqueness
        const existingUser = await User.findOne({
            where: {email}
        });
        if(existingUser) {
            res.status(400).json({
                message: 'Email already exists'
            });
            return;
        }

        // register new user
        const newUser = await User.create({
            name, email, password
        });
        res.status(200).json({
            message: 'User registered successfully',
            user: newUser
        });
    }
    catch(err) {
        res.status(500).json({
            message: "Error registering user", err
        });
    }
};

/**
 * login user
 * 
 * @return json
 */
export const authLogin = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        // check user by email
        const user = await User.findOne({
            where: {email}
        });
        if(!user) {
            res.status(400).json({
                message: 'Invalid email or password'
            });
            return;
        }

        // password verification
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            res.status(400).json({
                message: 'Invalid email or password'
            });
            return;
        }

        // create jwt token
        const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET!, {expiresIn: "1h"});

        res.json({
            message: 'Login successful',
            token
        });

    }
    catch(err) {
        res.status(500).json({
            message: "Error registering user", err
        });
    }
};