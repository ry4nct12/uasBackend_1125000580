const db = require('../config/database'); // Koneksi databasemu

// ==========================================
// 1. CREATE PAKET TRAVEL (Sisi Admin)
// ==========================================
exports.createPaket = async (req, res) => {
    const { nama_paket, deskripsi, harga_per_orang, kuota_maksimal, tanggal_keberangkatan, durasi_hari, id_wisata_array } = req.body;
    
    // id_wisata_array dikirim dari frontend berupa array ID wisata, contoh: [1, 3, 5]

    if (!nama_paket || !harga_per_orang || !kuota_maksimal || !id_wisata_array || id_wisata_array.length === 0) {
        return res.status(400).json({ success: false, message: "Data paket dan destinasi wisata wajib diisi" });
    }

    // Menggunakan Transaction agar jika salah satu insert gagal, semua dibatalkan (aman)
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // A. Insert ke tabel paket_travel terlebih dahulu
        const queryPaket = `
            INSERT INTO paket_travel (nama_paket, deskripsi, harga_per_orang, kuota_maksimal, tanggal_keberangkatan, durasi_hari, status_paket)
            VALUES (?, ?, ?, ?, ?, ?, 'tersedia')
        `;
        const [resultPaket] = await connection.execute(queryPaket, [nama_paket, deskripsi, harga_per_orang, kuota_maksimal, tanggal_keberangkatan, durasi_hari]);
        
        const id_paket_baru = resultPaket.insertId;

        // B. Insert relasi destinasi wisata ke tabel pivot paket_wisata secara berulang
        const queryPivot = `INSERT INTO paket_wisata (id_paket, id_wisata) VALUES (?, ?)`;
        for (let id_wisata of id_wisata_array) {
            await connection.execute(queryPivot, [id_paket_baru, id_wisata]);
        }

        // Jika semua proses aman, kunci data ke database
        await connection.commit();
        res.status(201).json({ success: true, message: "Paket travel beserta destinasi berhasil dibuat!" });

    } catch (error) {
        // Jika ada yang error di tengah jalan, batalkan semua perubahan yang terjadi
        await connection.rollback();
        res.status(500).json({ success: false, message: error.message });
    } finally {
        connection.release(); // Kembalikan koneksi ke pool
    }
};

// ==========================================
// 2. GET ALL PAKET (Sisi Pelanggan & Admin)
// ==========================================
exports.getAllPaket = async (req, res) => {
    try {
        // Menampilkan paket yang statusnya masih 'tersedia' untuk pelanggan
        const [rows] = await db.execute("SELECT * FROM paket_travel WHERE status_paket = 'tersedia' ORDER BY id DESC");
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 3. GET DETAIL PAKET + DAFTAR WISATA NYA (Sisi Pelanggan)
// ==========================================
exports.getDetailPaket = async (req, res) => {
    const { id } = req.params;

    try {
        // A. Ambil data utama paket travel
        const [paketRows] = await db.execute("SELECT * FROM paket_travel WHERE id = ?", [id]);
        if (paketRows.length === 0) {
            return res.status(404).json({ success: false, message: "Paket tidak ditemukan" });
        }

        // B. Ambil daftar destinasi wisata yang ada di dalam paket ini menggunakan JOIN lewat tabel pivot
        const queryWisata = `
            SELECT w.id, w.nama_wisata, w.lokasi, w.gambar_url, k.nama_kategori
            FROM paket_wisata pw
            JOIN wisata w ON pw.id_wisata = w.id
            JOIN kategori k ON w.id_kategori = k.id
            WHERE pw.id_paket = ?
        `;
        const [wisataRows] = await db.execute(queryWisata, [id]);

        // Gabungkan hasilnya dalam satu response JSON
        res.status(200).json({
            success: true,
            data: {
                ...paketRows[0],
                destinasi_wisata: wisataRows // Array berisi daftar objek wisata yang dikunjungi
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 4. UPDATE STATUS PAKET (Sisi Admin)
// ==========================================
exports.updateStatusPaket = async (req, res) => {
    const { id } = req.params;
    const { status_paket } = req.body; // 'tersedia', 'habis', atau 'selesai'

    try {
        await db.execute("UPDATE paket_travel SET status_paket = ? WHERE id = ?", [status_paket, id]);
        res.status(200).json({ success: true, message: "Status paket travel berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};