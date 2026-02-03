const { getDb } = require('../database/db');
const db = getDb();

// Get all salaries with optional filters
exports.getStaffSalaries = (req, res) => {
  const { month, year, staff_id } = req.query;
  let query = 'SELECT * FROM staff_salaries WHERE 1=1';
  const params = [];

  if (month) {
    query += ' AND month = ?';
    params.push(parseInt(month));
  }
  if (year) {
    query += ' AND year = ?';
    params.push(parseInt(year));
  }
  if (staff_id) {
    query += ' AND staff_id = ?';
    params.push(parseInt(staff_id));
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, salaries) => {
    if (err) {
      console.error('Error fetching salaries:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch salaries', error: err.message });
    }
    res.json({ success: true, salaries });
  });
};

// Get salary by ID
exports.getStaffSalaryById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM staff_salaries WHERE id = ?', [id], (err, salary) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to fetch salary', error: err.message });
    }
    if (!salary) {
      return res.status(404).json({ success: false, message: 'Salary record not found' });
    }
    res.json({ success: true, data: salary });
  });
};

// Create salary record
exports.createStaffSalary = (req, res) => {
  const {
    staff_id, staff_name, staff_email, staff_phone, staff_role,
    month, year,
    basic_salary, hra, da, ta, bonus, other_allowances,
    pf_deduction, tax_deduction, other_deductions,
    gross_salary, net_salary,
    payment_method, payment_date, notes,
  } = req.body;

  if (!staff_id || !month || !year) {
    return res.status(400).json({ success: false, message: 'Staff, month, and year are required' });
  }

  if (!basic_salary || parseFloat(basic_salary) <= 0) {
    return res.status(400).json({ success: false, message: 'Basic salary must be greater than 0' });
  }

  // Generate slip number
  const slipNumber = `SAL-${year}${String(month).padStart(2, '0')}-${Date.now().toString().slice(-6)}`;

  db.run(
    `INSERT INTO staff_salaries (
      staff_id, staff_name, staff_email, staff_phone, staff_role,
      month, year,
      basic_salary, hra, da, ta, bonus, other_allowances,
      pf_deduction, tax_deduction, other_deductions,
      gross_salary, net_salary,
      payment_method, payment_date, slip_number, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      staff_id, staff_name || null, staff_email || null, staff_phone || null, staff_role || null,
      parseInt(month), parseInt(year),
      parseFloat(basic_salary) || 0,
      parseFloat(hra) || 0,
      parseFloat(da) || 0,
      parseFloat(ta) || 0,
      parseFloat(bonus) || 0,
      parseFloat(other_allowances) || 0,
      parseFloat(pf_deduction) || 0,
      parseFloat(tax_deduction) || 0,
      parseFloat(other_deductions) || 0,
      parseFloat(gross_salary) || 0,
      parseFloat(net_salary) || 0,
      payment_method || 'Cash',
      payment_date || new Date().toISOString().split('T')[0],
      slipNumber,
      notes || null,
    ],
    function (err) {
      if (err) {
        console.error('Error creating salary:', err);
        return res.status(500).json({ success: false, message: 'Failed to create salary record', error: err.message });
      }

      res.status(201).json({
        success: true,
        message: 'Salary paid successfully',
        id: this.lastID,
        slip_number: slipNumber,
      });
    }
  );
};

// Update salary record
exports.updateStaffSalary = (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  const updates = [];
  const values = [];

  const allowedFields = [
    'basic_salary', 'hra', 'da', 'ta', 'bonus', 'other_allowances',
    'pf_deduction', 'tax_deduction', 'other_deductions',
    'gross_salary', 'net_salary', 'payment_method', 'payment_date', 'notes',
  ];

  allowedFields.forEach((field) => {
    if (fields[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(fields[field]);
    }
  });

  if (updates.length === 0) {
    return res.status(400).json({ success: false, message: 'No fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  db.run(`UPDATE staff_salaries SET ${updates.join(', ')} WHERE id = ?`, values, function (err) {
    if (err) {
      console.error('Error updating salary:', err);
      return res.status(500).json({ success: false, message: 'Failed to update salary', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Salary record not found' });
    }
    res.json({ success: true, message: 'Salary updated successfully' });
  });
};

// Delete salary record
exports.deleteStaffSalary = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM staff_salaries WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Error deleting salary:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete salary', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Salary record not found' });
    }
    res.json({ success: true, message: 'Salary record deleted successfully' });
  });
};

// Get payslips for a specific staff member
exports.getStaffPayslips = (req, res) => {
  const { staffId } = req.params;
  const { year } = req.query;

  let query = 'SELECT * FROM staff_salaries WHERE staff_id = ?';
  const params = [staffId];

  if (year) {
    query += ' AND year = ?';
    params.push(parseInt(year));
  }

  query += ' ORDER BY year DESC, month DESC';

  db.all(query, params, (err, payslips) => {
    if (err) {
      console.error('Error fetching payslips:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch payslips', error: err.message });
    }
    res.json({ success: true, data: payslips });
  });
};
