import mongoose from 'mongoose';

const hrSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['employee', 'admin', 'hr'], default: 'employee' }
}, { timestamps: true });

const HR = mongoose.model('HR', hrSchema);
export default HR;