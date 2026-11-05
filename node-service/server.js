// Node.js service: plant image uploads + order notification log
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;
const uploadDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname).toLowerCase()),
});
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    /^image\/(jpeg|png|webp)$/.test(file.mimetype) ? cb(null, true) : cb(new Error('Only JPG, PNG or WebP images are allowed')),
});

// Admin uploads a plant photo, gets back a URL to save with the plant
app.post('/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'Choose an image to upload' });
    res.json({ url: `http://localhost:${PORT}/uploads/${req.file.filename}` });
  });
});

// Called after checkout. Replace the console.log with nodemailer to send real emails.
app.post('/notify-order', (req, res) => {
  const { order_id, name, total } = req.body;
  console.log(`[ORDER] #${order_id} placed by ${name}, total Rs. ${total}`);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Node service running on http://localhost:${PORT}`));
