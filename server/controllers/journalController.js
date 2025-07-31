const JournalEntry = require('../models/JournalEntry');
const axios = require('axios');

/**
 * Creates a new journal entry with sentiment and emotion analysis
 * 
 * @route POST /api/journal
 * @desc Analyzes user's journal text using ML service and stores entry with sentiment/emotion data
 * @access Private (requires authentication)
 * 
 * @param {Object} req.body - Request body containing journal data
 * @param {string} req.body.text - User's journal entry text for analysis
 * @param {string} req.userid - User ID from JWT token
 * 
 * @returns {Object} 201 - Created journal entry with sentiment and emotion analysis
 * @returns {Object} 500 - Server error if ML service fails or database error
 */

exports.createEntry = async (req, res, next) => {
  try {
    const { text } = req.body;
    const userId = req.userid;
    
    // Try ML service first, fallback to simple analysis if unavailable
    let sentiment, emotion;
    try {
      const mlRes = await axios.post('http://localhost:5001/predict', { text });
      ({ sentiment, emotion } = mlRes.data);
    } catch (mlError) {
      console.warn('ML service unavailable, using fallback analysis');
      sentiment = text.includes('bad') || text.includes('sad') ? 'negative' : 
                 text.includes('good') || text.includes('happy') ? 'positive' : 'neutral';
      emotion = text.includes('sad') ? 'sadness' : 
               text.includes('happy') ? 'joy' : 'neutral';
    }
    
    const entry = await JournalEntry.create({ userId, text, sentiment, emotion });
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves all journal entries for the authenticated user sorted by creation date (newest first)
 * 
 * @route GET /api/journal
 * @desc Fetches user's journal entries with their sentiment/emotion analysis
 * @access Private (requires authentication)
 * 
 * @param {string} req.userid - User ID from JWT token
 * 
 * @returns {Array} 200 - Array of user's journal entries sorted by creation date (descending)
 * @returns {Object} 500 - Server error if database query fails
 */
exports.getEntries = async (req, res, next) => {
  try {
    const userId = req.userid;
    const entries = await JournalEntry.find({ userId }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves a single journal entry by ID for the authenticated user
 * 
 * @route GET /api/journal/:id
 * @desc Fetches a specific journal entry with sentiment/emotion analysis
 * @access Private (requires authentication)
 * 
 * @param {string} req.params.id - MongoDB ObjectId of the journal entry
 * @param {string} req.userid - User ID from JWT token
 * 
 * @returns {Object} 200 - Single journal entry object with all fields
 * @returns {Object} 404 - Entry not found error
 * @returns {Object} 500 - Server error if database query fails
 */

exports.getEntry = async (req, res, next) => {
  try {
    const userId = req.userid;
    const entry = await JournalEntry.findOne({ _id: req.params.id, userId });
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json(entry);
  } catch (err) {
    next(err);
  }
};

/**
 * Deletes a journal entry by ID for the authenticated user
 * 
 * @route DELETE /api/journal/:id
 * @desc Removes a specific journal entry from the database
 * @access Private (requires authentication)
 * 
 * @param {string} req.params.id - MongoDB ObjectId of the journal entry to delete
 * @param {string} req.userid - User ID from JWT token
 * 
 * @returns {Object} 200 - Success message confirming deletion
 * @returns {Object} 404 - Entry not found error
 * @returns {Object} 500 - Server error if database operation fails
 */

exports.deleteEntry = async (req, res, next) => {
  try {
    const userId = req.userid;
    const entry = await JournalEntry.findOneAndDelete({ _id: req.params.id, userId });
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};