const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

const seedAdmin = async () => {
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
        console.error('❌ Usage: node seedAdmin.js <email> <password>');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📡 Connected to Database...');

        // Check if exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('💡 User already exists. Upgrading to Admin and updating password...');
            userExists.isAdmin = true;
            userExists.plan = 'Pro';
            userExists.password = password; // The pre-save hook will hash this
            await userExists.save();
            console.log('👑 Upgraded existing user to SuperAdmin!');
            process.exit(0);
        }

        // Create new Admin
        // Do NOT hash manually, the Mongoose pre('save') hook handles hashing!
        await User.create({
            name: 'Super Admin',
            email,
            password: password,
            shopName: 'HQ Command Center',
            isAdmin: true,
            plan: 'Pro',
            subscriptionStatus: 'active'
        });

        console.log(`\n👑 SUCCESS! SuperAdmin Created.`);
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Password: ${password}`);
        console.log(`🤫 Secret URL: http://localhost:11000/admin-portal-v1\n`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

seedAdmin();
