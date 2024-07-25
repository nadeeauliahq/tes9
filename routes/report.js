router.post('/make', authenticate, authorize(['pegawai', 'admin']), async (req, res, next) => {
    try {
        const { namalaporan, productType, startperiod, endperiod } = req.body;

        if (!namalaporan || !productType || !startperiod || !endperiod) {
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

router.get('/view', authenticate, authorize(['manager', 'admin']), async (req, res, next) => {
    try {
        const { namalaporan, productType, startperiod, endperiod } = req.query;

        if (!namalaporan || !productType || !startperiod || !endperiod) {
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
                try {
                    report.data = JSON.parse(report.data);  // Parse JSON string kembali ke objek jika perlu
                } catch (parseError) {
                    // Tangani kesalahan parsing jika data tidak valid JSON
                    console.error('Error parsing JSON data:', parseError);
                    report.data = null;  // Atau bisa sesuaikan dengan kebutuhan Anda
                }
            }
        }

        // Mengirim respons JSON dengan indentasi untuk tampilan yang lebih rapi
        res.json(reports);
    } catch (err) {
        next(err);
    }
});
