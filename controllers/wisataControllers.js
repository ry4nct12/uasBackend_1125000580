const db = require('../db');

// 1. GET Semua Data Wisata (Termasuk JOIN ke tabel kategori)
const getAllWisata = async (req, res) => {
    try {
        const query = `
            SELECT w.id, w.nama_wisata, w.deskripsi, k.nama_kategori 
            FROM wisata w
            LEFT JOIN kategori k ON w.id_kategori = k.id
        `;
        const [rows] = await db.query(query);
        res.status(200).json({ message: "Berhasil mengambil data", data: rows });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};

// 2. GET Detail Wisata berdasarkan ID
const getWisataById = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT w.id, w.nama_wisata, w.deskripsi, k.nama_kategori 
            FROM wisata w
            LEFT JOIN kategori k ON w.id_kategori = k.id
            WHERE w.id = ?
        `;
        const [rows] = await db.query(query, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "Data wisata tidak ditemukan" });
        }
        res.status(200).json({ message: "Berhasil mengambil detail wisata", data: rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};

// 3. POST Tambah Data Wisata
const createWisata = async (req, res) => {
    const { nama_wisata, deskripsi, id_kategori } = req.body;
    try {
        const query = "INSERT INTO wisata (nama_wisata, deskripsi, id_kategori) VALUES (?, ?, ?)";
        const [result] = await db.query(query, [nama_wisata, deskripsi, id_kategori]);
        res.status(201).json({ message: "Data wisata berhasil ditambahkan", insertId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan saat menambah data", error: error.message });
    }
};

// 4. PUT Update Data Wisata
const updateWisata = async (req, res) => {
    const { id } = req.params;
    const { nama_wisata, deskripsi, id_kategori } = req.body;
    try {
        const query = "UPDATE wisata SET nama_wisata = ?, deskripsi = ?, id_kategori = ? WHERE id = ?";
        const [result] = await db.query(query, [nama_wisata, deskripsi, id_kategori, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Data wisata tidak ditemukan" });
        }
        res.status(200).json({ message: "Data wisata berhasil diupdate" });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan saat mengupdate data", error: error.message });
    }
};

// 5. DELETE Hapus Data Wisata
const deleteWisata = async (req, res) => {
    const { id } = req.params;
    try {
        const query = "DELETE FROM wisata WHERE id = ?";
        const [result] = await db.query(query, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Data wisata tidak ditemukan" });
        }
        res.status(200).json({ message: "Data wisata berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan saat menghapus data", error: error.message });
    }
};

module.exports = {
    getAllWisata,
    getWisataById,
    createWisata,
    updateWisata,
    deleteWisata
};