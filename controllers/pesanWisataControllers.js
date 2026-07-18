const db = require('../config/database');

exports.getWisataDetail = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM wisata WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: "Wisata tidak ditemukan" });
        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.bookWisata = async (req, res) => {
    const { id_wisata, jumlah_peserta, metode_bayar } = req.body;
    const id_user = req.user.id;

    try {
        const [rows] = await db.execute('SELECT harga_tiket FROM wisata WHERE id = ?', [id_wisata]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: "Wisata tidak ditemukan" });

        const total_bayar = parseFloat(rows[0].harga_tiket) * parseInt(jumlah_peserta);
        const kode_booking = `WIS-${Date.now()}`;

        const insertQuery = `
            INSERT INTO booking (kode_booking, id_user, id_wisata, id_paket, jumlah_peserta, total_bayar, status_bayar, metode_bayar)
            VALUES (?, ?, ?, NULL, ?, ?, 'pending', ?)
        `;
        await db.execute(insertQuery, [kode_booking, id_user, id_wisata, jumlah_peserta, total_bayar, metode_bayar]);

        res.status(201).json({ success: true, message: "Booking wisata berhasil!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};