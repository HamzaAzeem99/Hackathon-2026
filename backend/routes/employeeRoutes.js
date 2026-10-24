import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// HR registers a new employee
router.post('/register', async (req, res) => {
    try {
        const { name, email, tempPassword, employeeId, department, designation, phone, address, basicSalary, allowances } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // 2. Hash temporary password
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // 3. Create User Login (role: employee)
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'employee'
        });
        await newUser.save();

        // 4. Calculate Gross Salary (Basic + Allowances)
        const gross = Number(basicSalary) + Number(allowances || 0);

        // 5. Create Employee Profile
        const newEmployee = new Employee({
            userId: newUser._id,
            employeeId,
            department,
            designation,
            phone,
            address,
            salaryStructure: {
                basic: basicSalary,
                allowances: allowances || 0,
                gross
            }
        });
        await newEmployee.save();

        res.status(201).json({ 
            success: true, 
            message: 'Employee registered successfully and login created!',
            employee: newEmployee 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all employees (Directory & Search with filters)[cite: 4, 5]
router.get('/', async (req, res) => {
    try {
        const { department, search } = req.query;
        let query = {};

        if (department) {
            query.department = department;
        }

        const employees = await Employee.find(query).populate('userId', 'name email role');
        res.status(200).json({ success: true, employees });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;