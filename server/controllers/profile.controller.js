const { getDb } = require('../database/db');
const bcrypt = require('bcryptjs');

exports.getProfile = (req, res) => {
  // Check if user is authenticated FIRST
  if (!req.user) {
    console.error('Profile fetch error: req.user is completely missing');
    return res.status(401).json({ 
      success: false,
      message: 'Unauthorized. Please login again.',
      error: 'User not authenticated' 
    });
  }

  if (!req.user.id) {
    console.error('Profile fetch error: req.user.id is missing', { 
      user: req.user,
      userKeys: Object.keys(req.user || {})
    });
    return res.status(401).json({ 
      success: false,
      message: 'Unauthorized. Invalid token. Please login again.',
      error: 'User ID not found in token' 
    });
  }

  const userId = req.user.id;
  const db = getDb();

  // Check if database is available
  if (!db) {
    console.error('Database connection is not available');
    return res.status(500).json({ 
      success: false,
      message: 'Database connection error',
      error: 'Database not initialized' 
    });
  }

  try {
    db.get('SELECT id, email, name, phone, avatar, role, created_at FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) {
        console.error('Database error fetching profile:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to fetch profile',
          error: err.message 
        });
      }
      
      if (!user) {
        console.error('User not found in database:', userId);
        return res.status(404).json({ 
          success: false,
          message: 'User not found in database. Please login again.' 
        });
      }
      
      try {
        const profileData = {
          success: true,
          data: {
            id: user.id,
            email: user.email || '',
            name: user.name || '',
            phone: user.phone || '',
            avatar: user.avatar || '',
            role: user.role || 'admin',
            created_at: user.created_at
          }
        };
        
        res.json(profileData);
      } catch (jsonError) {
        console.error('Error sending response:', jsonError);
        if (!res.headersSent) {
          return res.status(500).json({ 
            success: false,
            message: 'Failed to send profile data',
            error: jsonError.message 
          });
        }
      }
    });
  } catch (error) {
    console.error('Unexpected error in getProfile:', error);
    if (!res.headersSent) {
      return res.status(500).json({ 
        success: false,
        message: 'Internal server error',
        error: error.message 
      });
    }
  }
};

exports.updateProfile = (req, res) => {
  // Check if user is authenticated
  if (!req.user || !req.user.id) {
    return res.status(401).json({ 
      success: false,
      message: 'Unauthorized. Please login again.' 
    });
  }

  const userId = req.user.id;
  const { name, phone, avatar, email } = req.body;
  const db = getDb();

  if (!db) {
    return res.status(500).json({ 
      success: false,
      message: 'Database connection error' 
    });
  }

  const updates = [];
  const values = [];

  if (name !== undefined) {
    updates.push('name = ?');
    values.push(name);
  }
  if (phone !== undefined) {
    updates.push('phone = ?');
    values.push(phone);
  }
  if (avatar !== undefined) {
    updates.push('avatar = ?');
    values.push(avatar);
  }
  if (email !== undefined) {
    updates.push('email = ?');
    values.push(email);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(userId);

  db.run(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
    values,
    (err) => {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ message: 'Email already exists' });
        }
        return res.status(500).json({ 
        success: false,
        message: 'Failed to update profile',
        error: err.message 
      });
      }
      res.json({ 
        success: true,
        message: 'Profile updated successfully' 
      });
    }
  );
};

exports.changePassword = (req, res) => {
  // Check if user is authenticated
  if (!req.user || !req.user.id) {
    return res.status(401).json({ 
      success: false,
      message: 'Unauthorized. Please login again.' 
    });
  }

  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required' });
  }

  const db = getDb();
  if (!db) {
    return res.status(500).json({ 
      success: false,
      message: 'Database connection error' 
    });
  }

  db.get('SELECT password FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    db.run(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedPassword, userId],
      (err) => {
        if (err) {
          return res.status(500).json({ 
          success: false,
          message: 'Failed to change password',
          error: err.message 
        });
        }
        res.json({ 
          success: true,
          message: 'Password changed successfully' 
        });
      }
    );
  });
};
