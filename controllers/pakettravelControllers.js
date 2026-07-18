const db = require('../config/database');

exports.getAllPaketTravel = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM paket_travel');
        res.json({ data: rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createPaketTravel = async (req, res) => {
    try {
        const { nama_paket, deskripsi, harga_per_orang, kuota_maksimal, tanggal_keberangkatan, durasi_hari, status_paket } = req.body;
        const query = `INSERT INTO paket_travel (nama_paket, deskripsi, harga_per_orang, kuota_maksimal, tanggal_keberangkatan, durasi_hari, status_paket) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.query(query, [nama_paket, deskripsi, harga_per_orang, kuota_maksimal, tanggal_keberangkatan, durasi_hari, status_paket]);
        res.json({ message: 'Paket Travel berhasil ditambahkan', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updatePaketTravel = async (req, res) => {
    try {
        const { nama_paket, deskripsi, harga_per_orang, kuota_maksimal, tanggal_keberangkatan, durasi_hari, status_paket } = req.body;
        const query = `UPDATE paket_travel SET nama_paket=?, deskripsi=?, harga_per_orang=?, kuota_maksimal=?, tanggal_keberangkatan=?, durasi_hari=?, status_paket=? 
                       WHERE id = ?`;
        await db.query(query, [nama_paket, deskripsi, harga_per_orang, kuota_maksimal, tanggal_keberangkatan, durasi_hari, status_paket, req.params.id]);
        res.json({ message: 'Paket Travel berhasil diperbarui' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deletePaketTravel = async (req, res) => {
    try {
        await db.query('DELETE FROM paket_travel WHERE id = ?', [req.params.id]);
        res.json({ message: 'Paket Travel berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};