const db = require('../config/database'); // Koneksi databasemu
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Gunakan secret key unik untuk JWT (idealnya disimpan di file .env)
const JWT_SECRET = process.env.JWT_SECRET || 'KUNCI_RAHASIA_TRAVEL_KU_123';

// ==========================================
// 1. REGISTER (Khusus Pelanggan Baru)
// ==========================================
exports.register = async (req, res) => {
    const { nama_lengkap, email, password, no_telp } = req.body;

    // Validasi input standar
    if (!nama_lengkap || !email || !password) {
        return res.status(400).json({ success: false, message: "Nama, email, dan password wajib diisi!" });
    }

    try {
        // Cek apakah email sudah terdaftar di database
        const [userExist] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (userExist.length > 0) {
            return res.status(400).json({ success: false, message: "Email sudah digunakan oleh akun lain" });
        }

        // Amankan password menggunakan bcrypt (salt round: 10)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Masukkan data user baru (default role: 'pelanggan' sesuai struktur table kita)
        const query = `
            INSERT INTO users (nama_lengkap, email, password, no_telp, role, status_akun) 
            VALUES (?, ?, ?, ?, 'pelanggan', 'aktif')
        `;
        await db.execute(query, [nama_lengkap, email, hashedPassword, no_telp]);

        res.status(201).json({ 
            success: true, 
            message: "Registrasi berhasil! Silakan login." 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 2. LOGIN (Untuk Admin & Pelanggan)
// ==========================================
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email dan password wajib diisi!" });
    }

    try {
        // Cari user berdasarkan email
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "Email atau password salah" });
        }

        const user = rows[0];

        // Cek apakah akun di-suspend oleh admin
        if (user.status_akun === 'suspend') {
            return res.status(403).json({ success: false, message: "Akun Anda ditangguhkan. Hubungi admin." });
        }

        // Bandingkan password yang diketik dengan yang ada di database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Email atau password salah" });
        }

        // Jika password cocok, buat JWT Token yang membawa ID dan Role user
        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' } // Token hangus dalam 1 hari
        );

        // Kirim response beserta token dan info user (tanpa password) ke frontend
        res.status(200).json({
            success: true,
            message: "Login berhasil!",
            token: token,
            user: {
                id: user.id,
                nama_lengkap: user.nama_lengkap,
                email: user.email,
                role: user.role // Frontend (React) bisa pakai ini untuk arahkan halaman dashboard/home
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};