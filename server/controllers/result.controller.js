const { getDb } = require('../database/db');
const db = getDb();

exports.getResults = (req, res) => {
  db.all('SELECT * FROM results ORDER BY year DESC, trade ASC', [], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch results' });
    }
    res.json(results);
  });
};
