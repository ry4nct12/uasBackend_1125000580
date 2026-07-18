const db = require('../config/database'); // Koneksi databasemu

// ==========================================
// 1. CREATE BOOKING (Pelanggan Memesan Paket)
// ==========================================
exports.createBooking = async (req, res) => {
    const { id_paket, jumlah_peserta, metode_bayar } = req.body;
    
    // id_user didapatkan dari JWT Token yang sudah didecode melalui middleware auth
    const id_user = req.user.id; 

    if (!id_paket || !jumlah_peserta) {
        return res.status(400).json({ success: false, message: "Paket dan jumlah peserta wajib diisi" });
    }

    try {
        // A. Ambil data paket untuk cek harga dan kuota
        const [paketRows] = await db.execute('SELECT harga_per_orang, kuota_maksimal, nama_paket FROM paket_travel WHERE id = ?', [id_paket]);
        if (paketRows.length === 0) {
            return res.status(404).json({ success: false, message: "Paket travel tidak ditemukan" });
        }
        
        const paket = paketRows[0];

        // B. Hitung total bayar di sisi backend (lebih aman)
        const total_bayar = paket.harga_per_orang * jumlah_peserta;

        // C. Generate Kode Booking Otomatis (Contoh: TRV-YYYYMMDD-RANDOM)
        const dateStr = new Date().toISOString().slice(0,10).replace(/-/g,"");
        const randomNum = Math.floor(100 + Math.random() * 900); // 3 digit acak
        const kode_booking = `TRV-${dateStr}-${randomNum}`;

        // D. Simpan data booking ke database
        const insertQuery = `
            INSERT INTO booking (kode_booking, id_user, id_paket, jumlah_peserta, total_bayar, status_bayar, metode_bayar)
            VALUES (?, ?, ?, ?, ?, 'pending', ?)
        `;
        await db.execute(insertQuery, [kode_booking, id_user, id_paket, jumlah_peserta, total_bayar, metode_bayar]);

        res.status(201).json({
            success: true,
            message: "Booking berhasil dibuat! Silakan lakukan pembayaran.",
            data: {
                kode_booking,
                nama_paket: paket.nama_paket,
                jumlah_peserta,
                total_bayar,
                status_bayar: 'pending',
                metode_bayar
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 2. GET RIWAYAT BOOKING (Sisi Pelanggan)
// ==========================================
exports.getPelangganBooking = async (req, res) => {
    const id_user = req.user.id; 

    try {
        const query = `
            SELECT p.*, t.nama_paket, t.tanggal_keberangkatan, t.durasi_hari
            FROM booking p
            LEFT JOIN paket_travel t ON p.id_paket = t.id
            WHERE p.id_user = ?
            ORDER BY p.tanggal_booking DESC
        `;
        const [rows] = await db.execute(query, [id_user]);
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllBooking = async (req, res) => {
    try {
        const query = `
            SELECT p.*, u.nama_lengkap, u.no_telp, t.nama_paket
            FROM booking p
            JOIN users u ON p.id_user = u.id
            LEFT JOIN paket_travel t ON p.id_paket = t.id
            ORDER BY p.tanggal_booking DESC
        `;
        const [rows] = await db.execute(query);
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 4. UPDATE STATUS BAYAR (Sisi Admin - Konfirmasi Pembayaran)
// ==========================================
exports.updateStatusBayar = async (req, res) => {
    const { id } = req.params; // ID booking
    const { status_bayar } = req.body; // 'sukses' atau 'batal'

    if (!['sukses', 'batal'].includes(status_bayar)) {
        return res.status(400).json({ success: false, message: "Status pembayaran tidak valid" });
    }

    try {
        const query = `UPDATE booking SET status_bayar = ? WHERE id = ?`;
        await db.execute(query, [status_bayar, id]);

        res.status(200).json({ 
            success: true, 
            message: `Status pembayaran booking ID ${id} berhasil diubah menjadi ${status_bayar}` 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};