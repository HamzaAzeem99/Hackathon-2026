import express from 'express';
import Leave from '../models/Leave.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// 1. Apply for Leave (Employee)
router.post('/apply', async (req, res) => {
    try {
        const { employeeId, leaveType, startDate, endDate, reason } = req.body;

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            return res.status(400).json({ message: 'Start date cannot be after end date' });
        }

        // Check for overlapping leaves for the same employee
        const overlapping = await Leave.findOne({
            employeeId,
            status: { $in: ['pending', 'approved'] },
            $or: [
                { startDate: { $lte: end }, endDate: { $gte: start } }
            ]
        });

        if (overlapping) {
            return res.status(422).json({ message: 'Leave request overlaps with an existing leave date' }); //[cite: 4]
        }

        const newLeave = new Leave({
            employeeId,
            leaveType,
            startDate: start,
            endDate: end,
            reason
        });

        await newLeave.save();
        res.status(201).json({ success: true, message: 'Leave application submitted successfully', leave: newLeave });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Approve or Reject Leave (HR / Admin)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, comment, hrUserId } = req.body; // status: 'approved' or 'rejected'
        
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status update' });
        }

        const leave = await Leave.findById(req.params.id);
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        leave.status = status;
        leave.comment = comment || '';
        leave.approvedBy = hrUserId;

        await leave.save();
        res.status(200).json({ success: true, message: `Leave request ${status}`, leave });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;