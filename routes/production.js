// routes/production.js
const express = require('express');
const router = express.Router();
const { Production } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

// Memasukkan data produksi
router.post('/input', authenticate, authorize(['pegawai']), async (req, res, next) => {
    try {
        const { totalproduk, type, date, stokproduk } = req.body;
        const newProduction = await Production.create({ totalproduk, type, date, stokproduk });
        res.status(201).json({ message: 'Data produksi berhasil disimpan' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
