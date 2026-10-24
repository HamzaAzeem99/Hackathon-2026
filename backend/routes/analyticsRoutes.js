import express from 'express';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import Payroll from '../models/Payroll.js';

const router = express.Router();

// 1. HR Dashboard Analytics
router.get('/hr-dashboard', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Headcount
        const totalHeadcount = await Employee.countDocuments({ status: 'active' });

        // Today's Attendance Stats
        const presentToday = await Attendance.countDocuments({ date: today, status: { $in: ['present', 'late', 'half_day'] } });
        const lateToday = await Attendance.countDocuments({ date: today, status: 'late' });
        
        // Pending Leaves
        const pendingLeaves = await Leave.countDocuments({ status: 'pending' });

        res.status(200).json({
            success: true,
            kpis: {
                headcount: totalHeadcount,
                presentToday,
                lateToday,
                pendingApprovals: pendingLeaves
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;