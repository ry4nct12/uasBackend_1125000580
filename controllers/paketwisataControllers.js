const db = require('../config/database'); // Pastikan koneksi db kamu menggunakan mysql2/promise

// Mengambil semua relasi antara paket dan wisata
exports.getAllPaketWisata = async (req, res) => {
    try {
        const query = `
            SELECT pw.*, pt.nama_paket, w.nama_wisata 
            FROM paket_wisata pw
            JOIN paket_travel pt ON pw.id_paket = pt.id
            JOIN wisata w ON pw.id_wisata = w.id
        `;
        const [results] = await db.query(query); // Menggunakan await
        res.json({ data: results });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Menambahkan wisata ke dalam paket (Create Relasi)
exports.addWisataToPaket = async (req, res) => {
    try {
        const { id_paket, id_wisata } = req.body;
        await db.query('INSERT INTO paket_wisata (id_paket, id_wisata) VALUES (?, ?)', [id_paket, id_wisata]);
        res.json({ message: 'Destinasi berhasil ditambahkan ke paket' });
    } catch (err) {
        res.status(500).json({ error: 'Relasi mungkin sudah ada atau data tidak valid.' });
    }
};

// Menghapus wisata dari paket (Delete Relasi)
exports.removeWisataFromPaket = async (req, res) => {
    try {
        const { id_paket, id_wisata } = req.params;
        await db.query('DELETE FROM paket_wisata WHERE id_paket = ? AND id_wisata = ?', [id_paket, id_wisata]);
        res.json({ message: 'Relasi berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};