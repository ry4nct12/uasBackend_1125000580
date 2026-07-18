const db = require('../config/database'); // Sesuaikan dengan koneksi databasemu

// 1. GET ALL WISATA (Bisa diakses Pelanggan & Admin)
exports.getAllWisata = async (req, res) => {
    try {
        // Kita gunakan JOIN untuk mengambil nama kategori sekaligus
        const query = `
            SELECT wisata.*, kategori.nama_kategori 
            FROM wisata 
            JOIN kategori ON wisata.id_kategori = kategori.id
            WHERE wisata.status_aktif = 'aktif'
        `;
        const [rows] = await db.execute(query);
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. GET WISATA BY ID (Detail Wisata + List Ulasannya)
exports.getWisataById = async (req, res) => {
    const { id } = req.params;
    try {
        // Ambil data detail wisatanya
        const wisataQuery = `SELECT * FROM wisata WHERE id = ?`;
        const [wisata] = await db.execute(wisataQuery, [id]);

        if (wisata.length === 0) {
            return res.status(404).json({ success: false, message: "Wisata tidak ditemukan" });
        }

        // Ambil juga ulasan dari para pengunjung untuk tempat wisata ini
        const ulasanQuery = `SELECT * FROM ulasan WHERE id_wisata = ? ORDER BY created_at DESC`;
        const [ulasan] = await db.execute(ulasanQuery, [id]);

        res.status(200).json({ 
            success: true, 
            data: wisata[0],
            ulasan: ulasan 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. CREATE WISATA (Hanya boleh diakses Admin)
exports.createWisata = async (req, res) => {
    const { id_kategori, nama_wisata, deskripsi, lokasi, alamat_lengkap, latitude, longitude, harga_tiket, jam_buka, jam_tutup, gambar_url } = req.body;
    try {
        const query = `
            INSERT INTO wisata (id_kategori, nama_wisata, deskripsi, lokasi, alamat_lengkap, latitude, longitude, harga_tiket, jam_buka, jam_tutup, gambar_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [id_kategori, nama_wisata, deskripsi, lokasi, alamat_lengkap, latitude, longitude, harga_tiket, jam_buka, jam_tutup, gambar_url]);
        res.status(201).json({ success: true, message: "Destinasi wisata berhasil ditambahkan", id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. UPDATE WISATA (Hanya boleh diakses Admin)
exports.updateWisata = async (req, res) => {
    const { id } = req.params;
    const { id_kategori, nama_wisata, deskripsi, lokasi, alamat_lengkap, latitude, longitude, harga_tiket, jam_buka, jam_tutup, gambar_url, status_aktif } = req.body;
    try {
        const query = `
            UPDATE wisata 
            SET id_kategori=?, nama_wisata=?, deskripsi=?, lokasi=?, alamat_lengkap=?, latitude=?, longitude=?, harga_tiket=?, jam_buka=?, jam_tutup=?, gambar_url=?, status_aktif=?
            WHERE id = ?
        `;
        await db.execute(query, [id_kategori, nama_wisata, deskripsi, lokasi, alamat_lengkap, latitude, longitude, harga_tiket, jam_buka, jam_tutup, gambar_url, status_aktif, id]);
        res.status(200).json({ success: true, message: "Data wisata berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. DELETE WISATA (Hanya boleh diakses Admin)
exports.deleteWisata = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute(`DELETE FROM wisata WHERE id = ?`, [id]);
        res.status(200).json({ success: true, message: "Destinasi wisata berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};