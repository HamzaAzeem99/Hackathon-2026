import dns from "dns"
import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import adminRoutes from './routes/adminRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import payrollRoutes from './routes/payrollRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());

dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Database Connect Call
connectDB();

// Routes Setup
app.use('/api/admin', adminRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
// Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: 'Server is up and running!',
        timestamp: new Date()
    });
});

// Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});