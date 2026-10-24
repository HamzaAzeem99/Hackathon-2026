import express from 'express';
import Setting from '../models/Setting.js';
import Department from '../models/Department.js';

const router = express.Router();

// 1. Save or Update Company Settings (Admin Only)
router.post('/settings', async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (settings) {
            settings = await Setting.findOneAndUpdate({}, req.body, { new: true });
        } else {
            settings = new Setting(req.body);
            await settings.save();
        }
        res.status(200).json({ success: true, message: 'Company settings saved successfully', settings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Create Department & Leave Quotas (Admin Only)
router.post('/departments', async (req, res) => {
    try {
        const { name, designations, leaveQuotas } = req.body;
        const newDept = new Department({ name, designations, leaveQuotas });
        await newDept.save();
        res.status(201).json({ success: true, message: 'Department created successfully', department: newDept });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;