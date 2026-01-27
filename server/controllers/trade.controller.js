const { getDb } = require('../database/db');
const db = getDb();
const path = require('path');
const fs = require('fs');

// Get all trades (public)
exports.getTrades = (req, res) => {
  console.log('[GET /api/trades] Fetching active trades...');
  console.log('[GET /api/trades] Request URL:', req.url);
  console.log('[GET /api/trades] Request path:', req.path);
  console.log('[GET /api/trades] Request method:', req.method);
  
  db.all('SELECT * FROM trades WHERE is_active = 1 ORDER BY name ASC', [], (err, trades) => {
    if (err) {
      console.error('[GET /api/trades] Database error:', err.message);
      // If table doesn't exist, return empty array instead of error
      if (err.message && err.message.includes('no such table')) {
        console.warn('[GET /api/trades] Trades table does not exist. Please restart the server to create it.');
        return res.json([]);
      }
      return res.status(500).json({ 
        success: false,
        message: 'Failed to fetch trades', 
        error: err.message 
      });
    }
    
    const tradeCount = trades?.length || 0;
    console.log(`[GET /api/trades] Successfully fetched ${tradeCount} active trades`);
    
    // Parse JSON fields
    const parsedTrades = (trades || []).map(trade => {
      try {
        return {
          ...trade,
          syllabus_json: trade.syllabus_json ? JSON.parse(trade.syllabus_json) : [],
          careers_json: trade.careers_json ? JSON.parse(trade.careers_json) : []
        };
      } catch (parseErr) {
        console.error(`[GET /api/trades] Error parsing JSON for trade ID ${trade.id}:`, parseErr.message);
        return {
          ...trade,
          syllabus_json: [],
          careers_json: []
        };
      }
    });
    
    res.json(parsedTrades);
  });
};

// Get all trades (admin - includes inactive)
exports.getAllTrades = (req, res) => {
  console.log('[GET /api/trades/admin/all] Fetching all trades (admin)...');
  db.all('SELECT * FROM trades ORDER BY name ASC', [], (err, trades) => {
    if (err) {
      console.error('[GET /api/trades/admin/all] Database error:', err.message);
      // If table doesn't exist, return empty array instead of error
      if (err.message && err.message.includes('no such table')) {
        console.warn('[GET /api/trades/admin/all] Trades table does not exist. Please restart the server to create it.');
        return res.json([]);
      }
      return res.status(500).json({ 
        success: false,
        message: 'Failed to fetch trades', 
        error: err.message 
      });
    }
    
    const tradeCount = trades?.length || 0;
    console.log(`[GET /api/trades/admin/all] Successfully fetched ${tradeCount} trades`);
    
    // Parse JSON fields
    const parsedTrades = (trades || []).map(trade => {
      try {
        return {
          ...trade,
          syllabus_json: trade.syllabus_json ? JSON.parse(trade.syllabus_json) : [],
          careers_json: trade.careers_json ? JSON.parse(trade.careers_json) : []
        };
      } catch (parseErr) {
        console.error(`[GET /api/trades/admin/all] Error parsing JSON for trade ID ${trade.id}:`, parseErr.message);
        return {
          ...trade,
          syllabus_json: [],
          careers_json: []
        };
      }
    });
    
    res.json(parsedTrades);
  });
};

// Get single trade by slug
exports.getTradeBySlug = (req, res) => {
  const { slug } = req.params;
  console.log(`[GET /api/trades/${slug}] Fetching trade by slug...`);
  
  db.get('SELECT * FROM trades WHERE slug = ?', [slug], (err, trade) => {
    if (err) {
      console.error(`[GET /api/trades/${slug}] Database error:`, err.message);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to fetch trade', 
        error: err.message 
      });
    }
    if (!trade) {
      console.warn(`[GET /api/trades/${slug}] Trade not found`);
      return res.status(404).json({ 
        success: false,
        message: 'Trade not found' 
      });
    }
    
    // Parse JSON fields
    let parsedTrade;
    try {
      parsedTrade = {
        ...trade,
        syllabus_json: trade.syllabus_json ? JSON.parse(trade.syllabus_json) : [],
        careers_json: trade.careers_json ? JSON.parse(trade.careers_json) : []
      };
      console.log(`[GET /api/trades/${slug}] Successfully fetched trade: ${trade.name}`);
    } catch (parseErr) {
      console.error(`[GET /api/trades/${slug}] Error parsing JSON:`, parseErr.message);
      parsedTrade = {
        ...trade,
        syllabus_json: [],
        careers_json: []
      };
    }
    
    res.json(parsedTrade);
  });
};

// Create trade
exports.createTrade = (req, res) => {
  console.log('[POST /api/trades] Creating new trade...');
  console.log('[POST /api/trades] Request body:', req.body);
  console.log('[POST /api/trades] Request files:', req.files);
  console.log('[POST /api/trades] Request file (single):', req.file);
  
  const { name, slug, category, description, image, duration, eligibility, seats, syllabus_json, careers_json, is_active } = req.body;
  
  // Handle file uploads - support both single and multiple file uploads
  let syllabus_pdf = null;
  let prospectus_pdf = null;
  
  try {
    if (req.files) {
      // Multiple file uploads (upload.fields)
      if (req.files['syllabus_pdf'] && Array.isArray(req.files['syllabus_pdf']) && req.files['syllabus_pdf'][0]) {
        syllabus_pdf = `/uploads/${req.files['syllabus_pdf'][0].filename}`;
        console.log('[POST /api/trades] Syllabus PDF uploaded:', syllabus_pdf);
      }
      if (req.files['prospectus_pdf'] && Array.isArray(req.files['prospectus_pdf']) && req.files['prospectus_pdf'][0]) {
        prospectus_pdf = `/uploads/${req.files['prospectus_pdf'][0].filename}`;
        console.log('[POST /api/trades] Prospectus PDF uploaded:', prospectus_pdf);
      }
    } else if (req.file) {
      // Single file upload (upload.single) - for backward compatibility
      if (req.file.fieldname === 'syllabus_pdf') {
        syllabus_pdf = `/uploads/${req.file.filename}`;
        console.log('[POST /api/trades] Syllabus PDF uploaded (single):', syllabus_pdf);
      } else if (req.file.fieldname === 'prospectus_pdf') {
        prospectus_pdf = `/uploads/${req.file.filename}`;
        console.log('[POST /api/trades] Prospectus PDF uploaded (single):', prospectus_pdf);
      }
    }
  } catch (fileError) {
    console.error('[POST /api/trades] Error processing files:', fileError);
    // Continue without files - they're optional
  }

  // Validation
  if (!name || !slug || !category || !description || !duration || !eligibility || !seats) {
    console.warn('[POST /api/trades] Validation failed: Missing required fields');
    console.warn('[POST /api/trades] Received fields:', { name, slug, category, description, duration, eligibility, seats });
    return res.status(400).json({ 
      success: false,
      message: 'Name, slug, category, description, duration, eligibility, and seats are required' 
    });
  }

  // Validate JSON fields if provided
  let parsedSyllabusJson = null;
  let parsedCareersJson = null;
  
  if (syllabus_json) {
    try {
      parsedSyllabusJson = typeof syllabus_json === 'string' ? JSON.parse(syllabus_json) : syllabus_json;
    } catch (parseErr) {
      console.error('[POST /api/trades] Invalid syllabus_json format:', parseErr.message);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid syllabus_json format' 
      });
    }
  }
  
  if (careers_json) {
    try {
      parsedCareersJson = typeof careers_json === 'string' ? JSON.parse(careers_json) : careers_json;
    } catch (parseErr) {
      console.error('[POST /api/trades] Invalid careers_json format:', parseErr.message);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid careers_json format' 
      });
    }
  }

  try {
    db.run(
      'INSERT INTO trades (name, slug, category, description, image, syllabus_pdf, prospectus_pdf, duration, eligibility, seats, syllabus_json, careers_json, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        name,
        slug,
        category,
        description,
        image || null,
        syllabus_pdf,
        prospectus_pdf,
        duration,
        eligibility,
        seats,
        parsedSyllabusJson ? JSON.stringify(parsedSyllabusJson) : null,
        parsedCareersJson ? JSON.stringify(parsedCareersJson) : null,
        is_active !== undefined ? (typeof is_active === 'string' ? parseInt(is_active) : is_active) : 1
      ],
      function (err) {
        if (err) {
          console.error('[POST /api/trades] Database error:', err.message);
          console.error('[POST /api/trades] Error stack:', err.stack);
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ 
              success: false,
              message: 'Trade with this name or slug already exists' 
            });
          }
          // Check if column doesn't exist (for old databases)
          if (err.message.includes('no such column: prospectus_pdf')) {
            console.error('[POST /api/trades] prospectus_pdf column does not exist. Please restart the server to add it.');
            return res.status(500).json({ 
              success: false,
              message: 'Database schema outdated. Please restart the server to update the database schema.' 
            });
          }
          return res.status(500).json({ 
            success: false,
            message: 'Failed to create trade', 
            error: err.message 
          });
        }
        console.log(`[POST /api/trades] Successfully created trade ID ${this.lastID}: ${name}`);
        res.json({ 
          success: true,
          id: this.lastID, 
          message: 'Trade created successfully' 
        });
      }
    );
  } catch (error) {
    console.error('[POST /api/trades] Unexpected error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Unexpected error occurred', 
      error: error.message 
    });
  }
};

// Update trade
exports.updateTrade = (req, res) => {
  const { id } = req.params;
  console.log(`[PUT /api/trades/${id}] Updating trade...`);
  console.log(`[PUT /api/trades/${id}] Request body:`, req.body);
  console.log(`[PUT /api/trades/${id}] Request files:`, req.files);
  console.log(`[PUT /api/trades/${id}] Request file (single):`, req.file);
  
  const { name, slug, category, description, image, duration, eligibility, seats, syllabus_json, careers_json, is_active, remove_pdf, remove_prospectus_pdf } = req.body;
  
  // Handle file uploads - support both single and multiple file uploads
  let newSyllabusPdf = null;
  let newProspectusPdf = null;
  
  try {
    if (req.files) {
      // Multiple file uploads (upload.fields)
      if (req.files['syllabus_pdf'] && Array.isArray(req.files['syllabus_pdf']) && req.files['syllabus_pdf'][0]) {
        newSyllabusPdf = `/uploads/${req.files['syllabus_pdf'][0].filename}`;
        console.log(`[PUT /api/trades/${id}] Syllabus PDF uploaded:`, newSyllabusPdf);
      }
      if (req.files['prospectus_pdf'] && Array.isArray(req.files['prospectus_pdf']) && req.files['prospectus_pdf'][0]) {
        newProspectusPdf = `/uploads/${req.files['prospectus_pdf'][0].filename}`;
        console.log(`[PUT /api/trades/${id}] Prospectus PDF uploaded:`, newProspectusPdf);
      }
    } else if (req.file) {
      // Single file upload (upload.single) - for backward compatibility
      if (req.file.fieldname === 'syllabus_pdf') {
        newSyllabusPdf = `/uploads/${req.file.filename}`;
        console.log(`[PUT /api/trades/${id}] Syllabus PDF uploaded (single):`, newSyllabusPdf);
      } else if (req.file.fieldname === 'prospectus_pdf') {
        newProspectusPdf = `/uploads/${req.file.filename}`;
        console.log(`[PUT /api/trades/${id}] Prospectus PDF uploaded (single):`, newProspectusPdf);
      }
    }
  } catch (fileError) {
    console.error(`[PUT /api/trades/${id}] Error processing files:`, fileError);
    // Continue without files - they're optional
  }

  // Validation
  if (!name || !slug || !category || !description || !duration || !eligibility || !seats) {
    console.warn(`[PUT /api/trades/${id}] Validation failed: Missing required fields`);
    return res.status(400).json({ 
      success: false,
      message: 'Name, slug, category, description, duration, eligibility, and seats are required' 
    });
  }

  // First get the current trade to handle PDF deletion
  db.get('SELECT syllabus_pdf, prospectus_pdf FROM trades WHERE id = ?', [id], (err, currentTrade) => {
    if (err) {
      console.error(`[PUT /api/trades/${id}] Error fetching current trade:`, err.message);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to fetch trade', 
        error: err.message 
      });
    }
    if (!currentTrade) {
      console.warn(`[PUT /api/trades/${id}] Trade not found`);
      return res.status(404).json({ 
        success: false,
        message: 'Trade not found' 
      });
    }

    let finalSyllabusPdf = currentTrade.syllabus_pdf;
    let finalProspectusPdf = currentTrade.prospectus_pdf;
    
    // Handle syllabus PDF
    if (newSyllabusPdf) {
      // Delete old PDF if exists
      if (currentTrade.syllabus_pdf) {
        const oldPdfPath = path.join(__dirname, '..', currentTrade.syllabus_pdf);
        if (fs.existsSync(oldPdfPath)) {
          fs.unlinkSync(oldPdfPath);
        }
      }
      finalSyllabusPdf = newSyllabusPdf;
    } else if (remove_pdf === 'true' && currentTrade.syllabus_pdf) {
      // Delete PDF if remove_pdf flag is set
      const oldPdfPath = path.join(__dirname, '..', currentTrade.syllabus_pdf);
      if (fs.existsSync(oldPdfPath)) {
        fs.unlinkSync(oldPdfPath);
      }
      finalSyllabusPdf = null;
    }
    
    // Handle prospectus PDF
    if (newProspectusPdf) {
      // Delete old PDF if exists
      if (currentTrade.prospectus_pdf) {
        const oldPdfPath = path.join(__dirname, '..', currentTrade.prospectus_pdf);
        if (fs.existsSync(oldPdfPath)) {
          fs.unlinkSync(oldPdfPath);
        }
      }
      finalProspectusPdf = newProspectusPdf;
    } else if (remove_prospectus_pdf === 'true' && currentTrade.prospectus_pdf) {
      // Delete PDF if remove_prospectus_pdf flag is set
      const oldPdfPath = path.join(__dirname, '..', currentTrade.prospectus_pdf);
      if (fs.existsSync(oldPdfPath)) {
        fs.unlinkSync(oldPdfPath);
      }
      finalProspectusPdf = null;
    }

    // Validate JSON fields if provided
    let parsedSyllabusJson = null;
    let parsedCareersJson = null;
    
    if (syllabus_json) {
      try {
        parsedSyllabusJson = typeof syllabus_json === 'string' ? JSON.parse(syllabus_json) : syllabus_json;
      } catch (parseErr) {
        console.error(`[PUT /api/trades/${id}] Invalid syllabus_json format:`, parseErr.message);
        return res.status(400).json({ 
          success: false,
          message: 'Invalid syllabus_json format' 
        });
      }
    }
    
    if (careers_json) {
      try {
        parsedCareersJson = typeof careers_json === 'string' ? JSON.parse(careers_json) : careers_json;
      } catch (parseErr) {
        console.error(`[PUT /api/trades/${id}] Invalid careers_json format:`, parseErr.message);
        return res.status(400).json({ 
          success: false,
          message: 'Invalid careers_json format' 
        });
      }
    }

    console.log(`[PUT /api/trades/${id}] Updating trade...`);
    try {
      db.run(
        'UPDATE trades SET name = ?, slug = ?, category = ?, description = ?, image = ?, syllabus_pdf = ?, prospectus_pdf = ?, duration = ?, eligibility = ?, seats = ?, syllabus_json = ?, careers_json = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [
          name,
          slug,
          category,
          description,
          image || null,
          finalSyllabusPdf,
          finalProspectusPdf,
          duration,
          eligibility,
          seats,
          parsedSyllabusJson ? JSON.stringify(parsedSyllabusJson) : null,
          parsedCareersJson ? JSON.stringify(parsedCareersJson) : null,
          is_active !== undefined ? (typeof is_active === 'string' ? parseInt(is_active) : is_active) : 1,
          id
        ],
        (err) => {
          if (err) {
            console.error(`[PUT /api/trades/${id}] Database error:`, err.message);
            console.error(`[PUT /api/trades/${id}] Error stack:`, err.stack);
            if (err.message.includes('UNIQUE')) {
              return res.status(400).json({ 
                success: false,
                message: 'Trade with this name or slug already exists' 
              });
            }
            // Check if column doesn't exist (for old databases)
            if (err.message.includes('no such column: prospectus_pdf')) {
              console.error(`[PUT /api/trades/${id}] prospectus_pdf column does not exist. Please restart the server to add it.`);
              return res.status(500).json({ 
                success: false,
                message: 'Database schema outdated. Please restart the server to update the database schema.' 
              });
            }
            return res.status(500).json({ 
              success: false,
              message: 'Failed to update trade', 
              error: err.message 
            });
          }
          console.log(`[PUT /api/trades/${id}] Successfully updated trade`);
          res.json({ 
            success: true,
            message: 'Trade updated successfully' 
          });
        }
      );
    } catch (error) {
      console.error(`[PUT /api/trades/${id}] Unexpected error:`, error);
      return res.status(500).json({ 
        success: false,
        message: 'Unexpected error occurred', 
        error: error.message 
      });
    }
  });
};

// Delete trade
exports.deleteTrade = (req, res) => {
  const { id } = req.params;
  console.log(`[DELETE /api/trades/${id}] Deleting trade...`);

  // Get trade to delete PDF if exists
  db.get('SELECT syllabus_pdf, prospectus_pdf FROM trades WHERE id = ?', [id], (err, trade) => {
    if (err) {
      console.error(`[DELETE /api/trades/${id}] Error fetching trade:`, err.message);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to fetch trade', 
        error: err.message 
      });
    }

    if (!trade) {
      console.warn(`[DELETE /api/trades/${id}] Trade not found`);
      return res.status(404).json({ 
        success: false,
        message: 'Trade not found' 
      });
    }

    // Delete PDF files if exist
    if (trade && trade.syllabus_pdf) {
      const pdfPath = path.join(__dirname, '..', trade.syllabus_pdf);
      if (fs.existsSync(pdfPath)) {
        try {
          fs.unlinkSync(pdfPath);
          console.log(`[DELETE /api/trades/${id}] Deleted syllabus PDF file: ${trade.syllabus_pdf}`);
        } catch (unlinkErr) {
          console.error(`[DELETE /api/trades/${id}] Error deleting syllabus PDF file:`, unlinkErr.message);
        }
      }
    }
    if (trade && trade.prospectus_pdf) {
      const pdfPath = path.join(__dirname, '..', trade.prospectus_pdf);
      if (fs.existsSync(pdfPath)) {
        try {
          fs.unlinkSync(pdfPath);
          console.log(`[DELETE /api/trades/${id}] Deleted prospectus PDF file: ${trade.prospectus_pdf}`);
        } catch (unlinkErr) {
          console.error(`[DELETE /api/trades/${id}] Error deleting prospectus PDF file:`, unlinkErr.message);
        }
      }
    }

    // Delete trade from database
    db.run('DELETE FROM trades WHERE id = ?', [id], (err) => {
      if (err) {
        console.error(`[DELETE /api/trades/${id}] Database error:`, err.message);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to delete trade', 
          error: err.message 
        });
      }
      console.log(`[DELETE /api/trades/${id}] Successfully deleted trade`);
      res.json({ 
        success: true,
        message: 'Trade deleted successfully' 
      });
    });
  });
};
