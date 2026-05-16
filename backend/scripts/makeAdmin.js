const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars from backend folder
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

const makeAdmin = async () => {
    const email = process.argv[2];

    if (!email) {
        console.error('❌ Please provide an email: node makeAdmin.js <email>');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📡 Connected to Database...');

        const user = await User.findOne({ email });

        if (!user) {
            console.error('❌ User not found');
            process.exit(1);
        }

        user.isAdmin = true;
        user.plan = 'Pro'; // Ensure admin is also Pro
        await user.save();

        console.log(`\n👑 SUCCESS! ${email} is now a SuperAdmin.`);
        console.log(`🤫 Secret URL: http://localhost:11000/admin-portal-v1\n`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

makeAdmin();
