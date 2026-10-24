import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employeeId: { type: String, required: true, unique: true }, // e.g. EMP-001
    department: { type: String, required: true },
    designation: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    salaryStructure: {
        basic: { type: Number, required: true },
        allowances: { type: Number, default: 0 },
        gross: { type: Number }
    },
    status: { type: String, enum: ['active', 'probation', 'exited'], default: 'probation' }
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;