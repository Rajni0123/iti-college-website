const { getDb } = require('../database/db');
const db = getDb();

exports.getGallery = (req, res) => {
  db.all('SELECT * FROM gallery ORDER BY created_at DESC', [], (err, gallery) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch gallery' });
    }
    res.json(gallery);
  });
};
