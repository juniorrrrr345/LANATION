const mongoose = require('mongoose');

// Schéma pour les utilisateurs du bot
const userSchema = new mongoose.Schema({
    userId: { type: Number, required: true, unique: true },
    username: String,
    firstName: String,
    lastName: String,
    isAdmin: { type: Boolean, default: false },
    firstSeen: { type: Date, default: Date.now },
    lastSeen: { type: Date, default: Date.now },
    messageCount: { type: Number, default: 0 }
}, { timestamps: true });

// Schéma pour les images uploadées
const imageSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, enum: ['welcome', 'info', 'other'], default: 'other' },
    uploadedBy: Number,
    uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.model('BotUser', userSchema);
const Image = mongoose.model('BotImage', imageSchema);

module.exports = {
    User,
    Image
};