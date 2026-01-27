const { getDb } = require('../database/db');
const bcrypt = require('bcryptjs');
const db = getDb();

// Default permissions for staff role
const DEFAULT_STAFF_PERMISSIONS = {
  dashboard: true,
  notices: true,
  results: true,
  gallery: true,
  admissions: true,
  fees: true,
  students: true,
  faculty: false,
  trades: false,
  about: false,
  admissionProcess: false,
  settings: false,
  staff: false,
  menus: false,
  categories: false,
  hero: false,
  flashNews: false,
  headerFooter: false,
  profile: true
};

// Get all staff (excluding current user)
exports.getAllStaff = (req, res) => {
  db.all(
    'SELECT id, email, name, phone, avatar, role, permissions, is_active, created_at FROM users WHERE role IN ("staff", "admin") ORDER BY created_at DESC',
    [],
    (err, staff) => {
      if (err) {
        console.error('Error fetching staff:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch staff',
          error: err.message
        });
      }

      const formattedStaff = staff.map(s => ({
        ...s,
        permissions: s.permissions ? JSON.parse(s.permissions) : (s.role === 'admin' ? {} : DEFAULT_STAFF_PERMISSIONS)
      }));

      res.json({
        success: true,
        data: formattedStaff
      });
    }
  );
};

// Get staff by ID
exports.getStaffById = (req, res) => {
  const { id } = req.params;

  db.get(
    'SELECT id, email, name, phone, avatar, role, permissions, is_active, created_at FROM users WHERE id = ?',
    [id],
    (err, staff) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch staff',
          error: err.message
        });
      }
      if (!staff) {
        return res.status(404).json({
          success: false,
          message: 'Staff not found'
        });
      }

      res.json({
        success: true,
        data: {
          ...staff,
          permissions: staff.permissions ? JSON.parse(staff.permissions) : DEFAULT_STAFF_PERMISSIONS
        }
      });
    }
  );
};

// Create staff member
exports.createStaff = (req, res) => {
  const { email, password, name, phone, role, permissions } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      message: 'Email, password, and name are required'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters'
    });
  }

  const staffRole = role || 'staff';
  const staffPermissions = permissions || DEFAULT_STAFF_PERMISSIONS;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO users (email, password, name, phone, role, permissions, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [email, hashedPassword, name, phone || null, staffRole, JSON.stringify(staffPermissions), 1],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({
            success: false,
            message: 'Email already exists'
          });
        }
        console.error('Error creating staff:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to create staff',
          error: err.message
        });
      }

      res.status(201).json({
        success: true,
        message: 'Staff created successfully',
        id: this.lastID
      });
    }
  );
};

// Update staff member
exports.updateStaff = (req, res) => {
  const { id } = req.params;
  const { email, name, phone, role, permissions, is_active, password } = req.body;

  const updates = [];
  const values = [];

  if (email !== undefined) {
    updates.push('email = ?');
    values.push(email);
  }
  if (name !== undefined) {
    updates.push('name = ?');
    values.push(name);
  }
  if (phone !== undefined) {
    updates.push('phone = ?');
    values.push(phone);
  }
  if (role !== undefined) {
    updates.push('role = ?');
    values.push(role);
  }
  if (permissions !== undefined) {
    updates.push('permissions = ?');
    values.push(JSON.stringify(permissions));
  }
  if (is_active !== undefined) {
    updates.push('is_active = ?');
    values.push(is_active ? 1 : 0);
  }
  if (password !== undefined && password.length > 0) {
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }
    updates.push('password = ?');
    values.push(bcrypt.hashSync(password, 10));
  }

  if (updates.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No fields to update'
    });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  db.run(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
    values,
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({
            success: false,
            message: 'Email already exists'
          });
        }
        console.error('Error updating staff:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to update staff',
          error: err.message
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Staff not found'
        });
      }

      res.json({
        success: true,
        message: 'Staff updated successfully'
      });
    }
  );
};

// Delete staff member
exports.deleteStaff = (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user.id;

  // Prevent deleting yourself
  if (parseInt(id) === currentUserId) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete your own account'
    });
  }

  db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Error deleting staff:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete staff',
        error: err.message
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found'
      });
    }

    res.json({
      success: true,
      message: 'Staff deleted successfully'
    });
  });
};

// Get default permissions
exports.getDefaultPermissions = (req, res) => {
  res.json({
    success: true,
    data: DEFAULT_STAFF_PERMISSIONS
  });
};
