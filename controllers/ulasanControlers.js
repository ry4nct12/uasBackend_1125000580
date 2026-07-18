const db = require('../config/database'); // Koneksi databasemu

// ==========================================
// 1. ADD ULASAN (Pelanggan Memberi Review & Rating)
// ==========================================
exports.addUlasan = async (req, res) => {
    const { id_wisata, nama_pengunjung, rating, komentar } = req.body;

    // Validasi input
    if (!id_wisata || !nama_pengunjung || !rating) {
        return res.status(400).json({ success: false, message: "Tempat wisata, nama, dan rating wajib diisi" });
    }

    // Validasi jangkauan rating harus 1 sampai 5
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: "Rating harus berkisar antara angka 1 sampai 5" });
    }

    try {
        // A. Cek dulu apakah tempat wisatanya memang ada
        const [wisataExist] = await db.execute('SELECT id FROM wisata WHERE id = ?', [id_wisata]);
        if (wisataExist.length === 0) {
            return res.status(404).json({ success: false, message: "Tempat wisata tidak ditemukan" });
        }

        // B. Masukkan data ulasan baru ke tabel ulasan
        const queryInsert = `
            INSERT INTO ulasan (id_wisata, nama_pengunjung, rating, komentar) 
            VALUES (?, ?, ?, ?)
        `;
        await db.execute(queryInsert, [id_wisata, nama_pengunjung, rating, komentar]);

        res.status(201).json({ 
            success: true, 
            message: "Ulasan dan rating Anda berhasil dikirim! Terima kasih." 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 2. GET ULASAN BY WISATA (Melihat Semua Review per Destinasi)
// ==========================================
exports.getUlasanByWisata = async (req, res) => {
    const { id_wisata } = req.params;

    try {
        // Ambil semua ulasan untuk satu tempat wisata, urutkan dari yang paling baru
        const query = `
            SELECT id, nama_pengunjung, rating, komentar, created_at 
            FROM ulasan 
            WHERE id_wisata = ? 
            ORDER BY created_at DESC
        `;
        const [rows] = await db.execute(query, [id_wisata]);

        // C. Tambahan fitur profesional: Hitung rata-rata rating (Avg Rating) lewat query SQL
        const queryAvg = `SELECT AVG(rating) as rata_rata FROM ulasan WHERE id_wisata = ?`;
        const [avgRows] = await db.execute(queryAvg, [id_wisata]);
        
        // Membulatkan hasil rata-rata menjadi 1 angka di belakang koma (misal: 4.7)
        const totalRating = avgRows[0].rata_rata ? parseFloat(avgRows[0].rata_rata).toFixed(1) : "0.0";

        res.status(200).json({ 
            success: true, 
            total_ulasan: rows.length,
            rata_rata_rating: totalRating,
            data: rows 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 3. DELETE ULASAN (Sisi Admin - Jika ada komentar toxic/spam)
// ==========================================
exports.deleteUlasan = async (req, res) => {
    const { id } = req.params; // ID Ulasan

    try {
        const [ulasanExist] = await db.execute('SELECT id FROM ulasan WHERE id = ?', [id]);
        if (ulasanExist.length === 0) {
            return res.status(404).json({ success: false, message: "Ulasan tidak ditemukan" });
        }

        await db.execute('DELETE FROM ulasan WHERE id = ?', [id]);
        res.status(200).json({ success: true, message: "Ulasan berhasil dihapus oleh admin" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};