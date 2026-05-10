const express = require('express');
require('dotenv').config();
const wisataRoutes = require('./routes/wisataRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk membaca JSON dari request body
app.use(express.json());

// Menggunakan routing untuk endpoint /api/wisata
app.use('/api/wisata', wisataRoutes);

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});