import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
    status: { 
        type: String, 
        enum: ['present', 'late', 'half_day', 'absent', 'missing_checkout'], 
        default: 'present' 
    },
    workHours: { type: Number, default: 0 }
}, { timestamps: true });

// Ensure unique attendance record per employee per day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;