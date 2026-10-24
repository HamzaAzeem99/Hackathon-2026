import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: String, required: true }, // Format: YYYY-MM
    basicSalary: { type: Number, required: true },
    grossSalary: { type: Number, required: true },
    deductions: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
    status: { type: String, enum: ['draft', 'finalized'], default: 'draft' }
}, { timestamps: true });

const Payroll = mongoose.model('Payroll', payrollSchema);
export default Payroll;