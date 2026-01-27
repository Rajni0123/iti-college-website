const { getDb } = require('../database/db');
const db = getDb();

// Get all active faculty (public)
exports.getAllFaculty = (req, res) => {
  console.log('[GET /api/faculty] Fetching all active faculty...');
  
  db.all(
    'SELECT * FROM faculty WHERE is_active = 1 ORDER BY is_principal DESC, display_order ASC',
    [],
    (err, faculty) => {
      if (err) {
        console.error('[GET /api/faculty] Database error:', err.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch faculty',
          error: err.message
        });
      }
      
      console.log(`[GET /api/faculty] Successfully fetched ${faculty.length} faculty members`);
      res.json({
        success: true,
        data: faculty
      });
    }
  );
};

// Get principal info (public)
exports.getPrincipal = (req, res) => {
  console.log('[GET /api/faculty/principal] Fetching principal info...');
  
  db.get(
    'SELECT * FROM faculty WHERE is_principal = 1 AND is_active = 1 LIMIT 1',
    [],
    (err, principal) => {
      if (err) {
        console.error('[GET /api/faculty/principal] Database error:', err.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch principal',
          error: err.message
        });
      }
      
      if (!principal) {
        return res.status(404).json({
          success: false,
          message: 'Principal not found'
        });
      }
      
      console.log('[GET /api/faculty/principal] Successfully fetched principal');
      res.json({
        success: true,
        data: principal
      });
    }
  );
};

// Get faculty by department (public)
exports.getFacultyByDepartment = (req, res) => {
  const { department } = req.params;
  console.log(`[GET /api/faculty/department/${department}] Fetching faculty...`);
  
  db.all(
    'SELECT * FROM faculty WHERE department = ? AND is_active = 1 AND is_principal = 0 ORDER BY display_order ASC',
    [department],
    (err, faculty) => {
      if (err) {
        console.error(`[GET /api/faculty/department/${department}] Database error:`, err.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch faculty',
          error: err.message
        });
      }
      
      console.log(`[GET /api/faculty/department/${department}] Successfully fetched ${faculty.length} faculty members`);
      res.json({
        success: true,
        data: faculty
      });
    }
  );
};

// Get all faculty for admin (including inactive)
exports.getAllFacultyAdmin = (req, res) => {
  console.log('[GET /api/faculty/admin/all] Fetching all faculty (admin)...');
  
  db.all(
    'SELECT * FROM faculty ORDER BY is_principal DESC, display_order ASC',
    [],
    (err, faculty) => {
      if (err) {
        console.error('[GET /api/faculty/admin/all] Database error:', err.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch faculty',
          error: err.message
        });
      }
      
      console.log(`[GET /api/faculty/admin/all] Successfully fetched ${faculty.length} faculty members`);
      res.json({
        success: true,
        data: faculty
      });
    }
  );
};

// Get faculty by ID
exports.getFacultyById = (req, res) => {
  const { id } = req.params;
  console.log(`[GET /api/faculty/${id}] Fetching faculty...`);
  
  db.get(
    'SELECT * FROM faculty WHERE id = ?',
    [id],
    (err, faculty) => {
      if (err) {
        console.error(`[GET /api/faculty/${id}] Database error:`, err.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch faculty',
          error: err.message
        });
      }
      
      if (!faculty) {
        return res.status(404).json({
          success: false,
          message: 'Faculty not found'
        });
      }
      
      console.log(`[GET /api/faculty/${id}] Successfully fetched faculty: ${faculty.name}`);
      res.json({
        success: true,
        data: faculty
      });
    }
  );
};

// Create faculty
exports.createFaculty = (req, res) => {
  console.log('[POST /api/faculty] Creating new faculty...');
  console.log('[POST /api/faculty] Request body:', req.body);
  
  const {
    name, designation, department, qualification, experience,
    image, email, phone, bio, specialization, is_principal, display_order
  } = req.body;
  
  if (!name || !designation || !department) {
    return res.status(400).json({
      success: false,
      message: 'Name, designation, and department are required'
    });
  }
  
  db.run(
    `INSERT INTO faculty (
      name, designation, department, qualification, experience,
      image, email, phone, bio, specialization, is_principal, display_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name, designation, department, qualification || null, experience || null,
      image || null, email || null, phone || null, bio || null,
      specialization || null, is_principal || 0, display_order || 0
    ],
    function(err) {
      if (err) {
        console.error('[POST /api/faculty] Database error:', err.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to create faculty',
          error: err.message
        });
      }
      
      console.log(`[POST /api/faculty] Successfully created faculty with ID: ${this.lastID}`);
      res.status(201).json({
        success: true,
        message: 'Faculty created successfully',
        id: this.lastID
      });
    }
  );
};

// Update faculty
exports.updateFaculty = (req, res) => {
  const { id } = req.params;
  console.log(`[PUT /api/faculty/${id}] Updating faculty...`);
  console.log(`[PUT /api/faculty/${id}] Request body:`, req.body);
  
  const {
    name, designation, department, qualification, experience,
    image, email, phone, bio, specialization, is_principal, display_order, is_active
  } = req.body;
  
  db.run(
    `UPDATE faculty SET
      name = ?, designation = ?, department = ?, qualification = ?, experience = ?,
      image = ?, email = ?, phone = ?, bio = ?, specialization = ?,
      is_principal = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [
      name, designation, department, qualification, experience,
      image, email, phone, bio, specialization,
      is_principal, display_order, is_active, id
    ],
    function(err) {
      if (err) {
        console.error(`[PUT /api/faculty/${id}] Database error:`, err.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to update faculty',
          error: err.message
        });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Faculty not found'
        });
      }
      
      console.log(`[PUT /api/faculty/${id}] Successfully updated faculty`);
      res.json({
        success: true,
        message: 'Faculty updated successfully'
      });
    }
  );
};

// Delete faculty
exports.deleteFaculty = (req, res) => {
  const { id } = req.params;
  console.log(`[DELETE /api/faculty/${id}] Deleting faculty...`);
  
  db.run(
    'DELETE FROM faculty WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        console.error(`[DELETE /api/faculty/${id}] Database error:`, err.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to delete faculty',
          error: err.message
        });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Faculty not found'
        });
      }
      
      console.log(`[DELETE /api/faculty/${id}] Successfully deleted faculty`);
      res.json({
        success: true,
        message: 'Faculty deleted successfully'
      });
    }
  );
};
