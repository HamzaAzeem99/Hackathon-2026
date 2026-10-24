// utils/seedAdmin.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createDefaultAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 10);
            
            const admin = new User({
                name: 'System Admin',
                email: process.env.ADMIN_EMAIL || 'admin@hcm.com',
                password: hashedPassword,
                role: 'admin'
            });

            await admin.save();
            console.log('Default Admin created successfully in MongoDB!');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
};

module.exports = createDefaultAdmin;