"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getMe = exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const register = async (req, res) => {
    try {
        const { fullName, profilePicture } = req.body;
        const uid = req.user?.uid;
        const email = req.user?.email;
        if (!uid || !email) {
            res.status(400).json({ message: 'Invalid token data' });
            return;
        }
        const existingUser = await prisma.user.findUnique({ where: { id: uid } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const user = await prisma.user.create({
            data: {
                id: uid,
                email,
                fullName: fullName || '',
                profilePicture,
                lastLogin: new Date(),
            }
        });
        res.status(201).json(user);
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const uid = req.user?.uid;
        if (!uid) {
            res.status(400).json({ message: 'Invalid token data' });
            return;
        }
        // Attempt to update lastLogin if user exists
        const existingUser = await prisma.user.findUnique({ where: { id: uid } });
        if (!existingUser) {
            res.status(404).json({ message: 'User not found. Please register first.' });
            return;
        }
        const user = await prisma.user.update({
            where: { id: uid },
            data: { lastLogin: new Date() },
        });
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const uid = req.user?.uid;
        if (!uid) {
            res.status(400).json({ message: 'Invalid token data' });
            return;
        }
        const user = await prisma.user.findUnique({ where: { id: uid } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getMe = getMe;
const updateProfile = async (req, res) => {
    try {
        const uid = req.user?.uid;
        if (!uid) {
            res.status(400).json({ message: 'Invalid token data' });
            return;
        }
        const { fullName, profilePicture } = req.body;
        const user = await prisma.user.update({
            where: { id: uid },
            data: {
                ...(fullName && { fullName }),
                ...(profilePicture && { profilePicture })
            },
        });
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateProfile = updateProfile;
//# sourceMappingURL=auth.controller.js.map