const { getDb } = require('../database/db');
const path = require('path');
const fs = require('fs');

const db = getDb();

// Get all settings
exports.getAllSettings = (req, res) => {
  db.all('SELECT * FROM site_settings', [], (err, rows) => {
    if (err) {
      console.error('Error fetching settings:', err);
      // Return empty object if table doesn't exist
      if (err.message && err.message.includes('no such table')) {
        return res.json({});
      }
      return res.status(500).json({ message: 'Database error' });
    }
    
    // Convert to key-value object
    const settings = {};
    if (rows && rows.length > 0) {
      rows.forEach(row => {
        settings[row.setting_key] = row.setting_value;
      });
    }
    
    res.json(settings);
  });
};

// Update a setting
exports.updateSetting = (req, res) => {
  const { key, value } = req.body;

  if (!key || value === undefined) {
    return res.status(400).json({ message: 'Key and value are required' });
  }

  db.run(
    'INSERT OR REPLACE INTO site_settings (setting_key, setting_value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
    [key, value],
    (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to update setting' });
      }
      res.json({ message: 'Setting updated successfully' });
    }
  );
};

// Update multiple settings
exports.updateMultipleSettings = (req, res) => {
  const settings = req.body;

  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({ message: 'Settings object is required' });
  }

  const keys = Object.keys(settings);
  let completed = 0;
  let errors = [];

  keys.forEach(key => {
    db.run(
      'INSERT OR REPLACE INTO site_settings (setting_key, setting_value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
      [key, settings[key]],
      (err) => {
        if (err) {
          errors.push(key);
        }
        completed++;
        
        if (completed === keys.length) {
          if (errors.length > 0) {
            return res.status(500).json({ 
              message: 'Some settings failed to update',
              errors 
            });
          }
          res.json({ message: 'All settings updated successfully' });
        }
      }
    );
  });
};

// Upload Fee Structure PDF
exports.uploadFeeStructurePdf = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'PDF file is required' });
  }

  const pdfPath = req.file.filename;

  // Delete old PDF if exists
  db.get('SELECT setting_value FROM site_settings WHERE setting_key = ?', ['fee_structure_pdf'], (err, row) => {
    if (row && row.setting_value) {
      const oldPath = path.join(__dirname, '../uploads', row.setting_value);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Save new PDF path
    db.run(
      'INSERT OR REPLACE INTO site_settings (setting_key, setting_value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
      ['fee_structure_pdf', pdfPath],
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to save PDF path' });
        }
        res.json({ message: 'Fee structure PDF uploaded successfully', filename: pdfPath });
      }
    );
  });
};

// Get Fee Structure PDF
exports.getFeeStructurePdf = (req, res) => {
  db.get('SELECT setting_value FROM site_settings WHERE setting_key = ?', ['fee_structure_pdf'], (err, row) => {
    if (err || !row || !row.setting_value) {
      return res.status(404).json({ message: 'Fee structure PDF not found' });
    }

    const filePath = path.join(__dirname, '../uploads', row.setting_value);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'PDF file not found' });
    }

    res.download(filePath, 'Fee_Structure.pdf');
  });
};

// Get Fee Structure PDF info
exports.getFeeStructurePdfInfo = (req, res) => {
  db.get('SELECT setting_value, updated_at FROM site_settings WHERE setting_key = ?', ['fee_structure_pdf'], (err, row) => {
    if (err || !row || !row.setting_value) {
      return res.json({ exists: false });
    }

    const filePath = path.join(__dirname, '../uploads', row.setting_value);
    if (!fs.existsSync(filePath)) {
      return res.json({ exists: false });
    }

    res.json({ 
      exists: true, 
      filename: row.setting_value,
      updated_at: row.updated_at
    });
  });
};

// Upload Favicon
exports.uploadFavicon = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Favicon file is required' });
  }

  // Validate file type (should be .ico, .png, or .svg)
  const allowedTypes = ['.ico', '.png', '.svg', '.jpg', '.jpeg'];
  const ext = path.extname(req.file.originalname).toLowerCase();
  
  if (!allowedTypes.includes(ext)) {
    // Delete uploaded file
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ message: 'Favicon must be .ico, .png, .svg, .jpg, or .jpeg' });
  }

  const faviconPath = req.file.filename;

  // Delete old favicon if exists
  db.get('SELECT setting_value FROM site_settings WHERE setting_key = ?', ['favicon'], (err, row) => {
    if (row && row.setting_value) {
      const oldPath = path.join(__dirname, '../uploads', row.setting_value);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Save new favicon path
    db.run(
      'INSERT OR REPLACE INTO site_settings (setting_key, setting_value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
      ['favicon', faviconPath],
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to save favicon path' });
        }
        res.json({ message: 'Favicon uploaded successfully', filename: faviconPath });
      }
    );
  });
};

// Get Favicon info
exports.getFaviconInfo = (req, res) => {
  db.get('SELECT setting_value, updated_at FROM site_settings WHERE setting_key = ?', ['favicon'], (err, row) => {
    if (err || !row || !row.setting_value) {
      return res.json({ exists: false });
    }

    const filePath = path.join(__dirname, '../uploads', row.setting_value);
    if (!fs.existsSync(filePath)) {
      return res.json({ exists: false });
    }

    res.json({ 
      exists: true, 
      filename: row.setting_value,
      updated_at: row.updated_at
    });
  });
};
