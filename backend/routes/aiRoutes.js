import express from 'express';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';

const router = express.Router();

// AI Chat endpoint with tool routing simulation
router.post('/chat', async (req, res) => {
    try {
        const { prompt, role, employeeId } = req.body;
        
        let responseMessage = "I am your HCM Lite AI assistant.";

        // Simple tool routing based on user prompt or intent
        if (prompt.toLowerCase().includes('headcount')) {
            const count = await Employee.countDocuments({ status: 'active' });
            responseMessage = `The total active employee headcount is ${count}.`;
        } else if (prompt.toLowerCase().includes('leave balance') && role === 'employee') {
            const leaves = await Leave.countDocuments({ employeeId, status: 'approved' });
            responseMessage = `You have taken ${leaves} approved leaves so far.`;
        } else {
            responseMessage = "Based on company policy and records: " + prompt;
        }

        res.status(200).json({
            success: true,
            answer: responseMessage,
            source: 'AI-generated'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;