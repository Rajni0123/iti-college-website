const { getDb } = require('../database/db');
const db = getDb();

// Seed default menus
exports.seedMenus = (req, res) => {
  const defaultMenus = [
    ['Home', '/', null, null, 1, 1],
    ['About', '/about', null, null, 2, 1],
    ['Trades', '/trades', null, null, 3, 1],
    ['Admission', '/admission-process', null, null, 4, 1],
    ['Results', '/results', null, null, 5, 1],
    ['Faculty', '/faculty', null, null, 6, 1],
    ['Gallery', '/infrastructure', null, null, 7, 1],
    ['Contact', '/contact', null, null, 8, 1],
    ['Notice Board', '/notices', null, null, 9, 1],
    ['Fee Structure', '/fee-structure', null, null, 10, 1]
  ];

  // First, check if menus already exist
  db.get('SELECT COUNT(*) as count FROM menus', [], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to check menus', error: err.message });
    }
    
    if (row && row.count > 0) {
      return res.json({ message: 'Menus already exist', count: row.count });
    }

    // Insert default menus
    let inserted = 0;
    defaultMenus.forEach(([title, url, icon, parent_id, order_index, is_active], index) => {
      db.run(
        'INSERT INTO menus (title, url, icon, parent_id, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [title, url, icon, parent_id, order_index, is_active],
        (err) => {
          if (err) {
            console.error('Error seeding menu:', err);
          } else {
            inserted++;
          }
          
          // Send response after last insert
          if (index === defaultMenus.length - 1) {
            setTimeout(() => {
              res.json({ message: 'Default menus seeded successfully', inserted });
            }, 100);
          }
        }
      );
    });
  });
};

exports.getMenus = (req, res) => {
  db.all('SELECT * FROM menus ORDER BY order_index ASC, id ASC', [], (err, menus) => {
    if (err) {
      console.error('Error fetching menus:', err);
      // Return empty array if table doesn't exist yet, otherwise return error
      if (err.message && err.message.includes('no such table')) {
        return res.json([]);
      }
      return res.status(500).json({ message: 'Failed to fetch menus', error: err.message });
    }
    res.json(menus || []);
  });
};

exports.createMenu = (req, res) => {
  const { title, url, icon, parent_id, order_index, is_active } = req.body;

  if (!title || !url) {
    return res.status(400).json({ message: 'Title and URL are required' });
  }

  db.run(
    'INSERT INTO menus (title, url, icon, parent_id, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?)',
    [title, url, icon || null, parent_id || null, order_index || 0, is_active !== undefined ? is_active : 1],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to create menu' });
      }
      res.json({ id: this.lastID, message: 'Menu created successfully' });
    }
  );
};

exports.updateMenu = (req, res) => {
  const { id } = req.params;
  const { title, url, icon, parent_id, order_index, is_active } = req.body;

  db.run(
    'UPDATE menus SET title = ?, url = ?, icon = ?, parent_id = ?, order_index = ?, is_active = ? WHERE id = ?',
    [title, url, icon || null, parent_id || null, order_index || 0, is_active !== undefined ? is_active : 1, id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to update menu' });
      }
      res.json({ message: 'Menu updated successfully' });
    }
  );
};

exports.deleteMenu = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM menus WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete menu' });
    }
    res.json({ message: 'Menu deleted successfully' });
  });
};
