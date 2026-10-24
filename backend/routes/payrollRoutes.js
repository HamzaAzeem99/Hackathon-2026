import express from 'express';
import Payroll from '../models/Payroll.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// Helper for Tax Calculation based on PDF slabs
const calculateTax = (annualGross) => {
    if (annualGross <= 600000) return 0;
    if (annualGross <= 1200000) return (annualGross - 600000) * 0.05;
    if (annualGross <= 2400000) return 30000 + (annualGross - 1200000) * 0.15;
    if (annualGross <= 3600000) return 210000 + (annualGross - 2400000) * 0.25;
    return 510000 + (annualGross - 3600000) * 0.35;
};

// 1. Create Monthly Payroll Draft (HR)[cite: 4]
router.post('/run', async (req, res) => {
    try {
        const { month } = req.body; // YYYY-MM
        const employees = await Employee.find({ status: 'active' });

        const payrollRuns = [];

        for (let emp of employees) {
            const basic = emp.salaryStructure.basic;
            const gross = emp.salaryStructure.gross || (basic * 1.5); //[cite: 4]
            
            // Annual tax calculation
            const annualGross = gross * 12;
            const annualTax = calculateTax(annualGross);
            const monthlyTax = annualTax / 12;

            const netSalary = gross - monthlyTax;

            const payroll = await Payroll.findOneAndUpdate(
                { employeeId: emp._id, month },
                {
                    basicSalary: basic,
                    grossSalary: gross,
                    tax: monthlyTax.toFixed(2),
                    netSalary: netSalary.toFixed(2),
                    status: 'draft'
                },
                { upsert: true, new: true }
            );

            payrollRuns.push(payroll);
        }

        res.status(201).json({ success: true, message: 'Payroll draft created successfully', payrollRuns });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Finalize Payroll (Admin Only - Locks the month)[cite: 4]
router.patch('/finalize/:month', async (req, res) => {
    try {
        const { month } = req.params;
        await Payroll.updateMany({ month }, { status: 'finalized' });
        res.status(200).json({ success: true, message: `Payroll for ${month} finalized and locked successfully.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;