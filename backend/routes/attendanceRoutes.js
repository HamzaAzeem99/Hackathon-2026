import express from 'express';
import Attendance from '../models/Attendance.js';

const router = express.Router();

// Helper to get current date string (YYYY-MM-DD)
const getTodayDate = () => new Date().toISOString().split('T')[0];

// 1. Check In
router.post('/check-in', async (req, res) => {
    try {
        const { employeeId } = req.body;
        const today = getTodayDate();

        // Check if already checked in today
        const existingRecord = await Attendance.findOne({ employeeId, date: today });
        if (existingRecord) {
            return res.status(409).json({ message: 'Already checked in for today' }); //[cite: 4]
        }

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        // Rule: Late after 09:15[cite: 4, 5]
        let status = 'present';
        if (hours > 9 || (hours === 9 && minutes > 15)) {
            status = 'late';
        }

        const attendance = new Attendance({
            employeeId,
            date: today,
            checkInTime: now,
            status
        });

        await attendance.save();
        res.status(201).json({ success: true, message: 'Checked in successfully', attendance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Check Out
router.post('/check-out', async (req, res) => {
    try {
        const { employeeId } = req.body;
        const today = getTodayDate();

        const attendance = await Attendance.findOne({ employeeId, date: today });
        if (!attendance) {
            return res.status(404).json({ message: 'No check-in record found for today' });
        }

        if (attendance.checkOutTime) {
            return res.status(400).json({ message: 'Already checked out today' });
        }

        const now = new Date();
        attendance.checkOutTime = now;

        // Calculate work hours
        const diffMs = now - new Date(attendance.checkInTime);
        const workHours = diffMs / (1000 * 60 * 60);
        attendance.workHours = workHours.toFixed(2);

        // Rule: Half day if under 5 hours[cite: 4, 5]
        if (workHours < 5) {
            attendance.status = 'half_day';
        }

        await attendance.save();
        res.status(200).json({ success: true, message: 'Checked out successfully', attendance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;