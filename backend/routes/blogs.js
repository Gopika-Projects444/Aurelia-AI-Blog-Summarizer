const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect } = require('../middleware/auth');

// ─── AI Summarization Logic (no external API needed) ────────────────────────
function generateSummary(content) {
  // Split into sentences
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];

  // Score each sentence based on word frequency
  const wordFreq = {};
  const words = content.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
  words.forEach(word => {
    if (word.length > 3) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  const scoredSentences = sentences.map((sentence, index) => {
    const sentWords = sentence.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    const score = sentWords.reduce((acc, word) => acc + (wordFreq[word] || 0), 0) / sentWords.length;
    return { sentence: sentence.trim(), score, index };
  });

  // Pick top sentences (roughly 20-25% of original)
  const numSentences = Math.max(2, Math.ceil(sentences.length * 0.25));
  const topSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, numSentences)
    .sort((a, b) => a.index - b.index)
    .map(s => s.sentence);

  return topSentences.join(' ');
}

// @route  GET /api/blogs
// @desc   Get all blogs (with search & filter)
router.get('/', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 9 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'name');

    res.json({
      blogs,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  GET /api/blogs/my
// @desc   Get current user's blogs
router.get('/my', protect, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  GET /api/blogs/:id
// @desc   Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name email');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  POST /api/blogs
// @desc   Create a new blog
router.post('/', protect, async (req, res) => {
  const { title, content, category, tags, summary } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const blog = await Blog.create({
      title,
      content,
      category: category || 'Other',
      tags: tags || [],
      summary: summary || generateSummary(content),
      author: req.user._id,
      authorName: req.user.name
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  POST /api/blogs/summarize
// @desc   Generate AI summary for content
router.post('/summarize', protect, async (req, res) => {
  const { content } = req.body;
  if (!content || content.trim().length < 50) {
    return res.status(400).json({ message: 'Content must be at least 50 characters to summarize' });
  }

  try {
    const summary = generateSummary(content);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate summary' });
  }
});

// @route  PUT /api/blogs/:id
// @desc   Update a blog
router.put('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this blog' });
    }

    const { title, content, category, tags, summary } = req.body;
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.category = category || blog.category;
    blog.tags = tags || blog.tags;
    blog.summary = summary !== undefined ? summary : blog.summary;

    const updated = await blog.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  DELETE /api/blogs/:id
// @desc   Delete a blog
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
