const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    shopName: {
        type: String,
        required: true,
    },
    qrCodeUrl: {
        type: String,
    },
    plan: {
        type: String,
        enum: ['Free', 'Pro'],
        default: 'Pro', // Default to Pro for existing users to prevent interruption
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'inactive', 'trialing', 'past_due'],
        default: 'active',
    },
    stripeCustomerId: {
        type: String,
    },
    subscriptionId: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
