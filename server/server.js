require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(express.json());
app.use(cookieParser());

// CORS: allow frontend to send cookies (withCredentials)
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch(err => {
    console.error('DB connection error', err);
  });
