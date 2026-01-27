const { getDb } = require('../database/db');
const db = getDb();

// Get all sessions
exports.getAllSessions = (req, res) => {
  db.all('SELECT * FROM sessions ORDER BY start_year DESC', [], (err, sessions) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch sessions' });
    }
    res.json(sessions);
  });
};

// Get active sessions
exports.getActiveSessions = (req, res) => {
  db.all('SELECT * FROM sessions WHERE is_active = 1 ORDER BY start_year DESC', [], (err, sessions) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch active sessions' });
    }
    res.json(sessions);
  });
};

// Create new session
exports.createSession = (req, res) => {
  const { session_name, start_year, end_year, is_active } = req.body;

  if (!session_name || !start_year || !end_year) {
    return res.status(400).json({ message: 'Session name, start year, and end year are required' });
  }

  db.run(
    'INSERT INTO sessions (session_name, start_year, end_year, is_active) VALUES (?, ?, ?, ?)',
    [session_name, start_year, end_year, is_active !== undefined ? is_active : 1],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ message: 'Session already exists' });
        }
        return res.status(500).json({ message: 'Failed to create session' });
      }
      res.json({
        message: 'Session created successfully',
        id: this.lastID
      });
    }
  );
};

// Update session
exports.updateSession = (req, res) => {
  const { id } = req.params;
  const { session_name, start_year, end_year, is_active } = req.body;

  db.run(
    'UPDATE sessions SET session_name = ?, start_year = ?, end_year = ?, is_active = ? WHERE id = ?',
    [session_name, start_year, end_year, is_active, id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to update session' });
      }
      res.json({ message: 'Session updated successfully' });
    }
  );
};

// Delete session
exports.deleteSession = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM sessions WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete session' });
    }
    res.json({ message: 'Session deleted successfully' });
  });
};
