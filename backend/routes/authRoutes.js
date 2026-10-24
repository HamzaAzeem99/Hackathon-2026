import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import HR from '../models/HR.js'; // <-- Yahan User ki jagah HR kar diya

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await HR.findOne({ email }); // User.findOne ki jagah HR.findOne
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newHR = new HR({ // new User ki jagah new HR
            name,
            email,
            password: hashedPassword,
            role: 'employee'
        });

        await newHR.save();
        res.status(201).json({ message: 'Account created successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login route mein bhi User ki jagah HR use hoga
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hrUser = await HR.findOne({ email });
        
        if (!hrUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, hrUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: hrUser._id, role: hrUser.role },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: hrUser._id, name: hrUser.name, email: hrUser.email, role: hrUser.role }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;