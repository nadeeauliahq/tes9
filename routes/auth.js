// routes/auth.js
const express = require('express');
const router = express.Router();
const { User } = require('../models/index'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// routes register
router.post('/register', async (req, res, next) => {
    try {
        const { username, password, role } = req.body;
        if (!['admin', 'pegawai', 'manager'].includes(role)) {
            return res.status(400).json({ message: 'Role tidak valid' });
        }
        console.log('Creating user:', username, role);
        const newUser = await User.create({ username, password, role });
        console.log('New user created:', newUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error creating user:', err);
        next(err);
    }
});

// Route login
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, role: user.role },
            'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        next(err);
    }
});
module.exports = router;
