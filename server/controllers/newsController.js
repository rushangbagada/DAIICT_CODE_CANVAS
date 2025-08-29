const News = require('../models/news');

// Create a new news item
const createNews = async (req, res) => {
  try {
    const { title, image, description, category, date } = req.body;
    
    const newNews = new News({
      title,
      image,
      description,
      category,
      date: date || new Date()
    });

    const savedNews = await newNews.save();
    res.status(201).json({ message: 'News created successfully', news: savedNews });
  } catch (error) {
    res.status(500).json({ message: 'Error creating news', error: error.message });
  }
};

// Update a news item
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedNews = await News.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedNews) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json({ message: 'News updated successfully', news: updatedNews });
  } catch (error) {
    res.status(500).json({ message: 'Error updating news', error: error.message });
  }
};

// Delete a news item
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNews = await News.findByIdAndDelete(id);

    if (!deletedNews) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting news', error: error.message });
  }
};

// Get all news items
const getAllNews = async (req, res) => {
  try {
    const news = await News.find({}).sort({ date: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error: error.message });
  }
};

module.exports = {
  createNews,
  updateNews,
  deleteNews,
  getAllNews
};