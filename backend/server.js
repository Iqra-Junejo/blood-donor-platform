const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://db:27017/blooddb';

const Donor = mongoose.model('Donor', new mongoose.Schema({
  name: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Register donor
app.post('/donors', async (req, res) => {
  try {
    const donor = await Donor.create(req.body);
    res.status(201).json(donor);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// List / search donors  (?bloodGroup=A+&city=Karachi)
app.get('/donors', async (req, res) => {
  const filter = {};
  if (req.query.bloodGroup) filter.bloodGroup = req.query.bloodGroup;
  if (req.query.city) filter.city = new RegExp(req.query.city, 'i');
  const donors = await Donor.find(filter).sort({ createdAt: -1 });
  res.json(donors);
});

function connect() {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => { console.log('Mongo retry...', err.message); setTimeout(connect, 3000); });
}
connect();

app.listen(5000, () => console.log('Backend running on 5000'));
