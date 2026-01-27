const { getDb } = require('../database/db');
const db = getDb();

exports.getFlashNews = (req, res) => {
  db.all('SELECT * FROM flash_news WHERE is_active = 1 ORDER BY order_index ASC, created_at DESC', [], (err, news) => {
    if (err) {
      console.error('Error fetching flash news:', err);
      if (err.message && err.message.includes('no such table')) {
        return res.json([]);
      }
      return res.status(500).json({ message: 'Failed to fetch flash news', error: err.message });
    }
    res.json(news || []);
  });
};

exports.getAllFlashNews = (req, res) => {
  db.all('SELECT * FROM flash_news ORDER BY order_index ASC, created_at DESC', [], (err, news) => {
    if (err) {
      console.error('Error fetching all flash news:', err);
      if (err.message && err.message.includes('no such table')) {
        return res.json([]);
      }
      return res.status(500).json({ message: 'Failed to fetch flash news', error: err.message });
    }
    res.json(news || []);
  });
};

exports.createFlashNews = (req, res) => {
  const { title, content, link, is_active, order_index } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  db.run(
    'INSERT INTO flash_news (title, content, link, is_active, order_index) VALUES (?, ?, ?, ?, ?)',
    [title, content, link || null, is_active !== undefined ? is_active : 1, order_index || 0],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to create flash news' });
      }
      res.json({ id: this.lastID, message: 'Flash news created successfully' });
    }
  );
};

exports.updateFlashNews = (req, res) => {
  const { id } = req.params;
  const { title, content, link, is_active, order_index } = req.body;

  db.run(
    'UPDATE flash_news SET title = ?, content = ?, link = ?, is_active = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title, content, link || null, is_active !== undefined ? is_active : 1, order_index || 0, id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to update flash news' });
      }
      res.json({ message: 'Flash news updated successfully' });
    }
  );
};

exports.deleteFlashNews = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM flash_news WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete flash news' });
    }
    res.json({ message: 'Flash news deleted successfully' });
  });
};
