const mongoose = require('mongoose');
const CATEGORIES = ['General', 'Technology', 'Lifestyle','Travel','Food', 'Education'];
const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  category:{ type: String, enum: CATEGORIES, default:'General'},
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
module.exports.CATEGORIES = CATEGORIES;