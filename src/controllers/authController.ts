import { Request, Response } from "express";
import User from '../models/User';
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import transporter from '../config/mail';
import { resetPasswordTemplate } from "../templates/resetPasswordTemplate";

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

/**
 * Forgot password
 * 
 * @return json
 */
export const forgotPassword = async (req: Request, res: Response) => {
    const {email} = req.body;
    const user = await User.findOne({ where: { email } });
    if(!user) {
        res.status(404).json({
            message: 'User not found'
        });
        return;
    }

    // generate reset token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
        expiresIn: '1h'
    });

    // Save token in DB
    user.resetToken = token;
    user.resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // create reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    // sending email
    const responseEmail = await transporter.sendMail({
        from: `"Super Dev" <${process.env.MAIL_FROM}>`,
        replyTo: `"Super Dev" <superdev@gmail.com>`,
        to: email,
        subject: `Super Dev - Reset Password`,
        html: resetPasswordTemplate(resetLink)
    });

    res.status(200).json({
        message: 'Silahkan cek email anda untuk mengganti password',
        response: responseEmail
    });
};

/**
 * Route for reset password
 * 
 * @return json
 */
export const resetPassword = async (req: Request, res: Response) => {
    const {token, password} = req.body;

    try {
        // verify token
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as { id: number };

        // find user with matching token
        const user = await User.findOne({
            where: {
                id: decoded.id,
                resetToken: token
            }
        });

        if (!user || (user.resetTokenExpires?.getTime() ?? 0) < Date.now()) {
            res.status(400).json({
                message: 'Invalid or expired token'
            });
            return;
        }

        // update password
        user.password = await bcrypt.hash(password, 10);
        user.resetToken = null;
        user.resetTokenExpires = null;
        await user.save();

        res.status(200).json({ message: "Password has been reset successfully" });
    }
    catch(e) {
        res.status(400).json({
            message: 'Invalid Token'
        });
    }
};