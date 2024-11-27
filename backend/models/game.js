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

// Add these functions to your existing game.js file

async function saveGame() {
    try {
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(gameState)
        });
        const data = await response.json();
        if (response.ok) {
            showNotification('Game saved successfully', 'success');
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function loadGame() {
    try {
        const response = await fetch('/api/load', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            gameState = data;
            updateDisplay();
            showNotification('Game loaded successfully', 'success');
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function login(email, password) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            return true;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        showNotification(error.message, 'error');
        return false;
    }
}
