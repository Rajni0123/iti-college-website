const { getDb } = require('../database/db');
const db = getDb();

// Get Header Settings
exports.getHeaderSettings = (req, res) => {
  db.get('SELECT * FROM header_settings LIMIT 1', [], (err, row) => {
    if (err) {
      console.error('Error fetching header settings:', err);
      return res.status(500).json({ message: 'Failed to fetch header settings' });
    }
    res.json(row || {});
  });
};

// Update Header Settings
exports.updateHeaderSettings = (req, res) => {
  const { 
    phone, email, student_portal_link, student_portal_text, 
    ncvt_mis_link, ncvt_mis_text, staff_email_link, staff_email_text,
    logo_text, tagline 
  } = req.body;

  db.get('SELECT * FROM header_settings LIMIT 1', [], (err, existingRow) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (existingRow) {
      db.run(`UPDATE header_settings SET 
        phone = ?, email = ?, student_portal_link = ?, student_portal_text = ?,
        ncvt_mis_link = ?, ncvt_mis_text = ?, staff_email_link = ?, staff_email_text = ?,
        logo_text = ?, tagline = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [phone, email, student_portal_link, student_portal_text, 
         ncvt_mis_link, ncvt_mis_text, staff_email_link, staff_email_text,
         logo_text, tagline, existingRow.id],
        (err) => {
          if (err) {
            console.error('Error updating header settings:', err);
            return res.status(500).json({ message: 'Failed to update header settings' });
          }
          res.json({ message: 'Header settings updated successfully' });
        }
      );
    } else {
      db.run(`INSERT INTO header_settings (phone, email, student_portal_link, student_portal_text, 
              ncvt_mis_link, ncvt_mis_text, staff_email_link, staff_email_text, logo_text, tagline) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [phone, email, student_portal_link, student_portal_text, 
         ncvt_mis_link, ncvt_mis_text, staff_email_link, staff_email_text,
         logo_text, tagline],
        function(err) {
          if (err) {
            console.error('Error creating header settings:', err);
            return res.status(500).json({ message: 'Failed to create header settings' });
          }
          res.json({ message: 'Header settings created successfully' });
        }
      );
    }
  });
};

// Get Footer Settings
exports.getFooterSettings = (req, res) => {
  db.get('SELECT * FROM footer_settings LIMIT 1', [], (err, footer) => {
    if (err) {
      console.error('Error fetching footer settings:', err);
      return res.status(500).json({ message: 'Failed to fetch footer settings' });
    }
    
    db.all('SELECT * FROM footer_links WHERE is_active = 1 ORDER BY category, order_index', [], (err, links) => {
      if (err) {
        console.error('Error fetching footer links:', err);
        return res.status(500).json({ message: 'Failed to fetch footer links' });
      }
      
      res.json({
        settings: footer || {},
        links: links || []
      });
    });
  });
};

// Update Footer Settings
exports.updateFooterSettings = (req, res) => {
  const { 
    about_text, facebook_link, twitter_link, linkedin_link, youtube_link,
    address, phone, email, copyright_text, privacy_link, terms_link
  } = req.body;

  db.get('SELECT * FROM footer_settings LIMIT 1', [], (err, existingRow) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (existingRow) {
      db.run(`UPDATE footer_settings SET 
        about_text = ?, facebook_link = ?, twitter_link = ?, linkedin_link = ?, youtube_link = ?,
        address = ?, phone = ?, email = ?, copyright_text = ?, privacy_link = ?, terms_link = ?,
        updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [about_text, facebook_link, twitter_link, linkedin_link, youtube_link,
         address, phone, email, copyright_text, privacy_link, terms_link, existingRow.id],
        (err) => {
          if (err) {
            console.error('Error updating footer settings:', err);
            return res.status(500).json({ message: 'Failed to update footer settings' });
          }
          res.json({ message: 'Footer settings updated successfully' });
        }
      );
    } else {
      db.run(`INSERT INTO footer_settings (about_text, facebook_link, twitter_link, linkedin_link, youtube_link,
              address, phone, email, copyright_text, privacy_link, terms_link) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [about_text, facebook_link, twitter_link, linkedin_link, youtube_link,
         address, phone, email, copyright_text, privacy_link, terms_link],
        function(err) {
          if (err) {
            console.error('Error creating footer settings:', err);
            return res.status(500).json({ message: 'Failed to create footer settings' });
          }
          res.json({ message: 'Footer settings created successfully' });
        }
      );
    }
  });
};

// Get all footer links (admin)
exports.getAllFooterLinks = (req, res) => {
  db.all('SELECT * FROM footer_links ORDER BY category, order_index', [], (err, links) => {
    if (err) {
      console.error('Error fetching footer links:', err);
      return res.status(500).json({ message: 'Failed to fetch footer links' });
    }
    res.json(links || []);
  });
};

// Create footer link
exports.createFooterLink = (req, res) => {
  const { title, url, category, order_index, is_active } = req.body;

  if (!title || !url) {
    return res.status(400).json({ message: 'Title and URL are required' });
  }

  db.run('INSERT INTO footer_links (title, url, category, order_index, is_active) VALUES (?, ?, ?, ?, ?)',
    [title, url, category || 'quick_links', order_index || 0, is_active !== undefined ? is_active : 1],
    function(err) {
      if (err) {
        console.error('Error creating footer link:', err);
        return res.status(500).json({ message: 'Failed to create footer link' });
      }
      res.json({ id: this.lastID, message: 'Footer link created successfully' });
    }
  );
};

// Update footer link
exports.updateFooterLink = (req, res) => {
  const { id } = req.params;
  const { title, url, category, order_index, is_active } = req.body;

  if (!title || !url) {
    return res.status(400).json({ message: 'Title and URL are required' });
  }

  db.run('UPDATE footer_links SET title = ?, url = ?, category = ?, order_index = ?, is_active = ? WHERE id = ?',
    [title, url, category || 'quick_links', order_index || 0, is_active !== undefined ? is_active : 1, id],
    (err) => {
      if (err) {
        console.error('Error updating footer link:', err);
        return res.status(500).json({ message: 'Failed to update footer link' });
      }
      res.json({ message: 'Footer link updated successfully' });
    }
  );
};

// Delete footer link
exports.deleteFooterLink = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM footer_links WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting footer link:', err);
      return res.status(500).json({ message: 'Failed to delete footer link' });
    }
    res.json({ message: 'Footer link deleted successfully' });
  });
};
