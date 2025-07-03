const NewsEntry = require('../models/NewsEntry');
const axios = require('axios');

exports.createEntry = async (req, res, next) => {
  try {
    const { url, title, text, date } = req.body;
    const mlRes = await axios.post('http://localhost:5001/predict', { text });
    const { sentiment, emotion } = mlRes.data;
    const entry = await NewsEntry.create({ url, title, sentiment, emotion, date });
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
};

exports.getEntries = async (req, res, next) => {
  try {
    const entries = await NewsEntry.find().sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    next(err);
  }
};

exports.getEntry = async (req, res, next) => {
  try {
    const entry = await NewsEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json(entry);
  } catch (err) {
    next(err);
  }
};

exports.deleteEntry = async (req, res, next) => {
  try {
    const entry = await NewsEntry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}; 