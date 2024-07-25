// routes/report.js
const express = require('express');
const router = express.Router();
const { Report, Production } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');

// Membuat laporan kebutuhan produk

// authorize(['pegawai', 'admin']) -> pembatasan hak akses
router.post('/make', authenticate, authorize(['pegawai', 'admin']), async (req, res, next) => {
    try {
        const { namalaporan,productType,startperiod, endperiod } = req.body;

        if (!namalaporan ||!productType || !startperiod || !endperiod) {
            return res.status(400).json({ message: 'namalaporan, productType, startperiod, dan endperiod diperlukan' });
        }

        // Ambil data produksi sesuai periode
        const dataProduksi = await Production.findAll({
            where: {
                date: {
                    [Op.between]: [startperiod, endperiod]
                }
            }
        });

        // Simpan laporan dengan data produksi
        const newReport = await Report.create({
            namalaporan,
            productType,
            startperiod,
            endperiod,
            data: JSON.stringify(dataProduksi)  // Simpan data produksi sebagai JSON string
        });

        res.status(201).json({ message: 'Laporan kebutuhan produk berhasil dibuat', report: newReport });
    } catch (err) {
        next(err);
    }
});

// Mendapatkan laporan kebutuhan produk dengan rentang waktu
router.get('/view', authenticate, authorize(['manager', 'admin']), async (req, res, next) => {
    try {
        const { namalaporan,productType,startperiod, endperiod } = req.query;

        if (!namalaporan ||!productType || !startperiod || !endperiod) {
            return res.status(400).json({ message: 'nama laporan, productType, startperiod, dan endperiod diperlukan' });
        }

        const reports = await Report.findAll({
            where: {
                namalaporan,
                productType,
                startperiod: {
                    [Op.gte]: startperiod
                },
                endperiod: {
                    [Op.lte]: endperiod
                }
            }
        });

        if (reports.length === 0) {
            return res.status(404).json({ message: 'Laporan tidak ditemukan' });
        }

        // Mengubah data produksi dari JSON string ke objek jika perlu
        for (let report of reports) {
            if (report.data) {
                report.data = JSON.parse(report.data);  // Parse JSON string kembali ke objek jika perlu
            }
        }

        // Mengirim respons JSON dengan indentasi untuk tampilan yang lebih rapi
        res.json(reports);
    } catch (err) {
        next(err);
    }
});



module.exports = router;
