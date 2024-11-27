const mongoose = require('mongoose');

const gameStateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    cash: Number,
    revenue: Number,
    expenses: Number,
    profit: Number,
    assets: Number,
    liabilities: Number,
    employees: Number,
    marketShare: Number,
    productivity: Number,
    morale: Number,
    training: Number,
    month: Number,
    reputation: Number,
    innovations: Number,
    customerSatisfaction: Number,
    achievements: [String],
    marketConditions: {
        inflation: Number,
        gdpGrowth: Number,
        competitionLevel: String,
        industryGrowth: Number,
        consumerConfidence: Number
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('GameState', gameStateSchema);
