const express = require('express');
const cors = require('cors'); // <-- 1. Panggil package cors
const app = express();


app.use(cors()); // <-- 2. Gunakan cors (WAJIB di atas routes)
app.use(express.json()); // Supaya bisa membaca data JSON dari frontend

// Daftarkan semua route aplikasi travel kamu
app.use('/api/wisata', require('./routes/wisataRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/paket', require('./routes/paketRoutes'));
app.use('/api/booking', require('./routes/bookingRoutes'));
app.use('/api/ulasan', require('./routes/ulasanRoutes'));
app.use('/api/kategori', require('./routes/kategoriRoutes'));
app.use('/api/paket-wisata', require('./routes/paketWisataRoutes'));
app.use('/api/paket-travel', require('./routes/pakettravelRoutes'));
app.use('/api/pesan-wisata', require('./routes/pesanWisataRoutes'));

app.listen(3000, () => console.log('Server running on port 3000'));