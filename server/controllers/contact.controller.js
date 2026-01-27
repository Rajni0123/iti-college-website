const { getDb } = require('../database/db');
const db = getDb();

exports.submitContact = (req, res) => {
  const { name, email, phone, message } = req.body;

  db.run(
    'INSERT INTO contact (name, email, phone, message) VALUES (?, ?, ?, ?)',
    [name, email, phone, message],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to submit contact form' });
      }
      res.json({ message: 'Message sent successfully', id: this.lastID });
    }
  );
};
