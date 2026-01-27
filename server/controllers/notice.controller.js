const { getDb } = require('../database/db');
const db = getDb();

exports.getNotices = (req, res) => {
  db.all('SELECT * FROM notices ORDER BY created_at DESC', [], (err, notices) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch notices' });
    }
    res.json(notices);
  });
};

exports.getNotice = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM notices WHERE id = ?', [id], (err, notice) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch notice' });
    }
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json(notice);
  });
};
