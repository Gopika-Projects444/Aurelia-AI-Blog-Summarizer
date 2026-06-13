const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [50, 'Content must be at least 50 characters']
  },
  summary: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Other'],
    default: 'Other'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  tags: [String],
  readTime: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

// Calculate read time before saving
blogSchema.pre('save', function(next) {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  this.readTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
