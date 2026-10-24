import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Role Change API (Admin directly changing user roles)
router.put('/users/:id/role', verifyToken, verifyRole(['admin']), async (req, res) => {
    try {
        const { role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { role }, 
            { new: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        
        res.status(200).json({ message: 'Role updated successfully', updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. HR / Admin Employee Registration API
router.post('/register-employee', verifyToken, verifyRole(['admin', 'hr']), async (req, res) => {
    try {
        const { name, email, employeeCode, department, designation, phone, address, basicSalary } = req.body;

        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'employee'
        });
        await newUser.save();

        const newEmployee = new Employee({
            userId: newUser._id,
            employeeCode,
            department,
            designation,
            phone,
            address,
            salaryStructure: { basic: basicSalary }
        });
        await newEmployee.save();

        res.status(201).json({
            message: 'Employee registered successfully!',
            employee: newEmployee,
            temporaryPassword: tempPassword
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;