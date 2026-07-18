const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: "Token tidak ditemukan" });

    jwt.verify(token, 'KUNCI_RAHASIA_TRAVEL_KU_123', (err, decoded) => {
        if (err) return res.status(401).json({ message: "Token tidak valid" });
        req.user = decoded; // Menyimpan data id dan role dari token ke req.user
        next();
    });
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Akses ditolak, khusus Admin!" });
    }
    next();
};