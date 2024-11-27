const router = require('express').Router();
const GameState = require('../models/Game');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Authentication middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

// Register user
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) throw new Error('Invalid login credentials');
        
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) throw new Error('Invalid login credentials');
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Save game state
router.post('/save', auth, async (req, res) => {
    try {
        let gameState = await GameState.findOne({ userId: req.user._id });
        if (gameState) {
            Object.assign(gameState, req.body);
        } else {
            gameState = new GameState({
                ...req.body,
                userId: req.user._id
            });
        }
        await gameState.save();
        res.json(gameState);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Load game state
router.get('/load', auth, async (req, res) => {
    try {
        const gameState = await GameState.findOne({ userId: req.user._id });
        if (!gameState) throw new Error('No saved game found');
        res.json(gameState);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;
