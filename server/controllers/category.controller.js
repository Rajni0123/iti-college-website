const { getDb } = require('../database/db');
const db = getDb();

exports.getCategories = (req, res) => {
  db.all('SELECT * FROM categories ORDER BY order_index ASC, id ASC', [], (err, categories) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch categories' });
    }
    res.json(categories);
  });
};

exports.createCategory = (req, res) => {
  const { name, slug, description, parent_id, order_index, is_active } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ message: 'Name and slug are required' });
  }

  db.run(
    'INSERT INTO categories (name, slug, description, parent_id, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?)',
    [name, slug, description || null, parent_id || null, order_index || 0, is_active !== undefined ? is_active : 1],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ message: 'Category with this name or slug already exists' });
        }
        return res.status(500).json({ message: 'Failed to create category' });
      }
      res.json({ id: this.lastID, message: 'Category created successfully' });
    }
  );
};

exports.updateCategory = (req, res) => {
  const { id } = req.params;
  const { name, slug, description, parent_id, order_index, is_active } = req.body;

  db.run(
    'UPDATE categories SET name = ?, slug = ?, description = ?, parent_id = ?, order_index = ?, is_active = ? WHERE id = ?',
    [name, slug, description || null, parent_id || null, order_index || 0, is_active !== undefined ? is_active : 1, id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to update category' });
      }
      res.json({ message: 'Category updated successfully' });
    }
  );
};

exports.deleteCategory = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM categories WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete category' });
    }
    res.json({ message: 'Category deleted successfully' });
  });
};
