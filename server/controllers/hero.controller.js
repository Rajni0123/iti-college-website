const { getDb } = require('../database/db');
const db = getDb();

exports.getHero = (req, res) => {
  db.all('SELECT * FROM hero_section WHERE is_active = 1 ORDER BY id DESC', [], (err, heroes) => {
    if (err) {
      console.error('Error fetching hero section:', err);
      if (err.message && err.message.includes('no such table')) {
        return res.json([]);
      }
      return res.status(500).json({ message: 'Failed to fetch hero section', error: err.message });
    }
    res.json(heroes || []);
  });
};

exports.getAllHero = (req, res) => {
  db.all('SELECT * FROM hero_section ORDER BY id DESC', [], (err, heroes) => {
    if (err) {
      console.error('Error fetching all hero sections:', err);
      if (err.message && err.message.includes('no such table')) {
        return res.json([]);
      }
      return res.status(500).json({ message: 'Failed to fetch hero sections', error: err.message });
    }
    res.json(heroes || []);
  });
};

exports.createHero = (req, res) => {
  const { title, subtitle, description, background_image, cta_text, cta_link, cta2_text, cta2_link, is_active } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  // Deactivate all other hero sections if this one is active
  if (is_active) {
    db.run('UPDATE hero_section SET is_active = 0', [], () => {});
  }

  db.run(
    'INSERT INTO hero_section (title, subtitle, description, background_image, cta_text, cta_link, cta2_text, cta2_link, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [title, subtitle || null, description || null, background_image || null, cta_text || null, cta_link || null, cta2_text || null, cta2_link || null, is_active !== undefined ? is_active : 1],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to create hero section' });
      }
      res.json({ id: this.lastID, message: 'Hero section created successfully' });
    }
  );
};

exports.updateHero = (req, res) => {
  const { id } = req.params;
  const { title, subtitle, description, background_image, cta_text, cta_link, cta2_text, cta2_link, is_active } = req.body;

  // Deactivate all other hero sections if this one is being activated
  if (is_active) {
    db.run('UPDATE hero_section SET is_active = 0 WHERE id != ?', [id], () => {});
  }

  db.run(
    'UPDATE hero_section SET title = ?, subtitle = ?, description = ?, background_image = ?, cta_text = ?, cta_link = ?, cta2_text = ?, cta2_link = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title, subtitle || null, description || null, background_image || null, cta_text || null, cta_link || null, cta2_text || null, cta2_link || null, is_active !== undefined ? is_active : 1, id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to update hero section' });
      }
      res.json({ message: 'Hero section updated successfully' });
    }
  );
};

exports.deleteHero = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM hero_section WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete hero section' });
    }
    res.json({ message: 'Hero section deleted successfully' });
  });
};
