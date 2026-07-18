const db = require('../config/database');

exports.getAllKategori = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM kategori');
        res.json({ data: results });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createKategori = async (req, res) => {
    try {
        const { nama_kategori } = req.body;

        const [result] = await db.query(
            'INSERT INTO kategori (nama_kategori) VALUES (?)',
            [nama_kategori]
        );

        res.json({
            message: 'Kategori berhasil ditambahkan',
            id: result.insertId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateKategori = async (req, res) => {
    try {
        const { nama_kategori } = req.body;

        await db.query(
            'UPDATE kategori SET nama_kategori = ? WHERE id = ?',
            [nama_kategori, req.params.id]
        );

        res.json({ message: 'Kategori berhasil diperbarui' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteKategori = async (req, res) => {
    try {
        await db.query(
            'DELETE FROM kategori WHERE id = ?',
            [req.params.id]
        );

        res.json({ message: 'Kategori berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};