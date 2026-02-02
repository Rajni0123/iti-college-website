const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../database/db');
const fs = require('fs');
const path = require('path');

const db = getDb();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  });
};

// Dashboard Stats
exports.getDashboardStats = (req, res) => {
  const stats = {};
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weekAgoStr = oneWeekAgo.toISOString().split('T')[0];

  // Get total notices and this week's notices
  db.get('SELECT COUNT(*) as count FROM notices', [], (err, row) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    stats.totalNotices = row?.count || 0;

    db.get('SELECT COUNT(*) as count FROM notices WHERE DATE(created_at) >= ?', [weekAgoStr], (err, row) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      stats.noticesThisWeek = row?.count || 0;

      // Get total results and this week's results
      db.get('SELECT COUNT(*) as count FROM results', [], (err, row) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        stats.totalResults = row?.count || 0;

        db.get('SELECT COUNT(*) as count FROM results WHERE DATE(created_at) >= ?', [weekAgoStr], (err, row) => {
          if (err) return res.status(500).json({ message: 'Database error' });
          stats.resultsThisWeek = row?.count || 0;

          // Get latest result update time
          db.get('SELECT created_at FROM results ORDER BY created_at DESC LIMIT 1', [], (err, row) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            stats.lastResultUpdate = row?.created_at || null;

            // Get total gallery photos
            db.get('SELECT COUNT(*) as count FROM gallery', [], (err, row) => {
              if (err) return res.status(500).json({ message: 'Database error' });
              stats.galleryPhotos = row?.count || 0;

              db.get('SELECT COUNT(*) as count FROM gallery WHERE DATE(created_at) >= ?', [weekAgoStr], (err, row) => {
                if (err) return res.status(500).json({ message: 'Database error' });
                stats.galleryThisWeek = row?.count || 0;

                // Get admission stats
                db.get('SELECT COUNT(*) as count FROM admissions WHERE LOWER(status) = "pending"', [], (err, row) => {
                  if (err) return res.status(500).json({ message: 'Database error' });
                  stats.pendingAdmissions = row?.count || 0;

                  db.get('SELECT COUNT(*) as count FROM admissions WHERE LOWER(status) = "approved"', [], (err, row) => {
                    if (err) return res.status(500).json({ message: 'Database error' });
                    stats.approvedAdmissions = row?.count || 0;

                    db.get('SELECT COUNT(*) as count FROM admissions WHERE LOWER(status) = "rejected"', [], (err, row) => {
                      if (err) return res.status(500).json({ message: 'Database error' });
                      stats.rejectedAdmissions = row?.count || 0;

                      db.get('SELECT COUNT(*) as count FROM admissions', [], (err, row) => {
                        if (err) return res.status(500).json({ message: 'Database error' });
                        stats.totalAdmissions = row?.count || 0;

                        db.get('SELECT COUNT(*) as count FROM admissions WHERE DATE(created_at) >= ?', [weekAgoStr], (err, row) => {
                          if (err) return res.status(500).json({ message: 'Database error' });
                          stats.admissionsThisWeek = row?.count || 0;

                          // Get faculty count
                          db.get('SELECT COUNT(*) as count FROM faculty WHERE is_active = 1', [], (err, row) => {
                            if (err) {
                              // Faculty table might not exist
                              stats.totalFaculty = 0;
                            } else {
                              stats.totalFaculty = row?.count || 0;
                            }

                            // Get trades count
                            db.get('SELECT COUNT(*) as count FROM trades WHERE is_active = 1', [], (err, row) => {
                              if (err) {
                                stats.totalTrades = 0;
                              } else {
                                stats.totalTrades = row?.count || 0;
                              }

                              // Get students with high dues (>50%)
                              db.all(`
                                SELECT 
                                  s.id,
                                  s.student_name,
                                  s.mobile,
                                  s.trade,
                                  s.enrollment_number,
                                  COALESCE(SUM(sf.amount), 0) as total_dues,
                                  COALESCE(SUM(sf.paid_amount), 0) as total_paid,
                                  COALESCE(MAX(sf.payment_date), '') as last_payment_date,
                                  COALESCE(MAX(sf.paid_amount), 0) as last_paid_amount
                                FROM students s
                                LEFT JOIN student_fees sf ON s.id = sf.admission_id OR s.student_name = sf.student_name
                                WHERE s.status = 'Active'
                                GROUP BY s.id, s.student_name, s.mobile, s.trade, s.enrollment_number
                                HAVING total_dues > 0 AND (total_paid / total_dues) < 0.5
                                ORDER BY (total_paid / total_dues) ASC, total_dues DESC
                                LIMIT 20
                              `, [], (err, highDuesStudents) => {
                                if (err) {
                                  stats.highDuesStudents = [];
                                } else {
                                  stats.highDuesStudents = (highDuesStudents || []).map(s => ({
                                    id: s.id,
                                    student_name: s.student_name,
                                    mobile: s.mobile,
                                    trade: s.trade,
                                    enrollment_number: s.enrollment_number,
                                    total_dues: parseFloat(s.total_dues) || 0,
                                    total_paid: parseFloat(s.total_paid) || 0,
                                    last_payment_date: s.last_payment_date || '',
                                    last_paid_amount: parseFloat(s.last_paid_amount) || 0,
                                    dues_percentage: s.total_dues > 0 ? ((s.total_paid / s.total_dues) * 100).toFixed(1) : 0
                                  }));
                                }

                                // Get recent activities
                                db.all(`
                                  SELECT 'notice' as type, title, created_at FROM notices
                                  UNION ALL
                                  SELECT 'result' as type, title, created_at FROM results
                                  UNION ALL
                                  SELECT 'admission' as type, name as title, created_at FROM admissions
                                  ORDER BY created_at DESC LIMIT 5
                                `, [], (err, activities) => {
                                  if (err) {
                                    stats.recentActivities = [];
                                  } else {
                                    stats.recentActivities = activities || [];
                                  }
                                  res.json(stats);
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

// Notices
exports.createNotice = (req, res) => {
  const { title, description } = req.body;
  const pdf = req.file ? req.file.filename : null;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  db.run(
    'INSERT INTO notices (title, description, pdf) VALUES (?, ?, ?)',
    [title, description, pdf],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to create notice' });
      }
      res.json({ id: this.lastID, message: 'Notice created successfully' });
    }
  );
};

exports.updateNotice = (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const pdf = req.file ? req.file.filename : null;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  // Get existing notice to preserve PDF if not updating
  db.get('SELECT pdf FROM notices WHERE id = ?', [id], (err, notice) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    const finalPdf = pdf || notice.pdf;

    db.run(
      'UPDATE notices SET title = ?, description = ?, pdf = ? WHERE id = ?',
      [title, description, finalPdf, id],
      (err) => {
        if (err) return res.status(500).json({ message: 'Failed to update notice' });
        res.json({ message: 'Notice updated successfully' });
      }
    );
  });
};

exports.deleteNotice = (req, res) => {
  const { id } = req.params;

  db.get('SELECT pdf FROM notices WHERE id = ?', [id], (err, notice) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    db.run('DELETE FROM notices WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ message: 'Failed to delete notice' });

      if (notice && notice.pdf) {
        const filePath = path.join(__dirname, '../uploads', notice.pdf);
        fs.unlink(filePath, () => {});
      }

      res.json({ message: 'Notice deleted successfully' });
    });
  });
};

// Results
exports.createResult = (req, res) => {
  const { title, trade, year } = req.body;
  const pdf = req.file ? req.file.filename : null;

  if (!title || !trade || !year) {
    return res.status(400).json({ message: 'Title, trade, and year are required' });
  }

  if (!pdf) {
    return res.status(400).json({ message: 'PDF file is required' });
  }

  db.run(
    'INSERT INTO results (title, trade, year, pdf) VALUES (?, ?, ?, ?)',
    [title, trade, year, pdf],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to create result' });
      }
      res.json({ id: this.lastID, message: 'Result uploaded successfully' });
    }
  );
};

exports.deleteResult = (req, res) => {
  const { id } = req.params;

  db.get('SELECT pdf FROM results WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    db.run('DELETE FROM results WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ message: 'Failed to delete result' });

      if (result && result.pdf) {
        const filePath = path.join(__dirname, '../uploads', result.pdf);
        fs.unlink(filePath, () => {});
      }

      res.json({ message: 'Result deleted successfully' });
    });
  });
};

// Gallery
exports.uploadGalleryImage = (req, res) => {
  const { category } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!category) {
    return res.status(400).json({ message: 'Category is required' });
  }

  if (!image) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  db.run(
    'INSERT INTO gallery (image, category) VALUES (?, ?)',
    [image, category],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to upload image' });
      }
      res.json({ id: this.lastID, message: 'Image uploaded successfully' });
    }
  );
};

exports.deleteGalleryImage = (req, res) => {
  const { id } = req.params;

  db.get('SELECT image FROM gallery WHERE id = ?', [id], (err, item) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    db.run('DELETE FROM gallery WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ message: 'Failed to delete image' });

      if (item && item.image) {
        const filePath = path.join(__dirname, '../uploads', item.image);
        fs.unlink(filePath, () => {});
      }

      res.json({ message: 'Image deleted successfully' });
    });
  });
};

// Admissions
exports.getAdmissions = (req, res) => {
  const { trade, status, date, page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  let countQuery = 'SELECT COUNT(*) as total FROM admissions WHERE 1=1';
  let query = 'SELECT * FROM admissions WHERE 1=1';
  const params = [];
  const countParams = [];

  if (trade) {
    query += ' AND trade = ?';
    countQuery += ' AND trade = ?';
    params.push(trade);
    countParams.push(trade);
  }
  if (status) {
    query += ' AND status = ?';
    countQuery += ' AND status = ?';
    params.push(status);
    countParams.push(status);
  }
  if (date) {
    query += ' AND DATE(created_at) = ?';
    countQuery += ' AND DATE(created_at) = ?';
    params.push(date);
    countParams.push(date);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limitNum, offset);

  // Get total count
  db.get(countQuery, countParams, (err, countResult) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch admissions count' });
    }

    const total = countResult.total || 0;
    const totalPages = Math.ceil(total / limitNum);

    // Get admissions
    db.all(query, params, (err, admissions) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to fetch admissions' });
      }

      // Format admissions data
      const formattedAdmissions = admissions.map((admission) => {
        const documents = JSON.parse(admission.documents || '{}');
        const nameParts = admission.name.split(' ');
        const initials = nameParts.length >= 2 
          ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
          : admission.name.substring(0, 2).toUpperCase();
        
        const colors = ['indigo', 'emerald', 'rose', 'amber', 'blue', 'purple'];
        const colorIndex = admission.id % colors.length;

        const date = new Date(admission.created_at);
        const formattedDate = date.toLocaleDateString('en-GB', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        });

        return {
          id: `ITI-2024-${String(admission.id).padStart(4, '0')}`,
          dbId: admission.id,
          name: admission.name,
          father_name: admission.father_name,
          mobile: admission.mobile,
          email: admission.email,
          trade: admission.trade,
          qualification: admission.qualification,
          category: admission.category,
          status: admission.status.toLowerCase(),
          documents: documents,
          initials: initials,
          color: colors[colorIndex],
          dateSubmitted: formattedDate,
          created_at: admission.created_at
        };
      });

      res.json({
        admissions: formattedAdmissions,
        total: total,
        totalPages: totalPages,
        currentPage: pageNum
      });
    });
  });
};

exports.updateAdmissionStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Pending', 'Approved', 'Rejected', 'pending', 'approved', 'rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  // First get admission details
  db.get('SELECT * FROM admissions WHERE id = ?', [id], (err, admission) => {
    if (err) {
      console.error('Error fetching admission:', err);
      return res.status(500).json({ message: 'Failed to fetch admission details' });
    }

    if (!admission) {
      return res.status(404).json({ message: 'Admission not found' });
    }

    // Update admission status
    db.run('UPDATE admissions SET status = ? WHERE id = ?', [normalizedStatus, id], function(err) {
      if (err) {
        console.error('Error updating admission status:', err);
        return res.status(500).json({ message: 'Failed to update status' });
      }

      // If status is Approved, create student record
      if (normalizedStatus === 'Approved') {
        console.log('[STUDENT CREATE] Status is Approved, checking for existing student...');
        console.log('[STUDENT CREATE] Admission data:', JSON.stringify(admission, null, 2));
        
        // Check if student already exists for this admission
        db.get('SELECT id FROM students WHERE admission_id = ?', [id], (err, existingStudent) => {
          if (err) {
            console.error('Error checking existing student:', err);
            // Still return success for status update
            return res.json({ message: 'Status updated successfully, but failed to create student record' });
          }

          if (existingStudent) {
            // Student already exists, just return success
            console.log('[STUDENT CREATE] Student already exists with ID:', existingStudent.id);
            return res.json({ message: 'Status updated successfully. Student record already exists.' });
          }
          
          console.log('[STUDENT CREATE] No existing student found, creating new student record...');

          // Parse documents to get photo
          let documents = {};
          try {
            documents = JSON.parse(admission.documents || '{}');
          } catch (e) {
            documents = {};
          }

          // Generate enrollment number
          const currentYear = new Date().getFullYear();
          const academicYear = `${currentYear}-${currentYear + 1}`;
          
          // Create student record from admission data with all fields
          const studentData = {
            admission_id: id,
            student_name: admission.name,
            father_name: admission.father_name,
            mother_name: admission.mother_name,
            mobile: admission.mobile,
            email: admission.email,
            trade: admission.trade,
            enrollment_number: null, // Will be set by admin later
            admission_date: new Date().toISOString().split('T')[0],
            qualification: admission.qualification,
            category: admission.category,
            address: null,
            photo: documents.photo || null,
            status: 'Active',
            academic_year: academicYear,
            uidai_number: admission.uidai_number,
            village_town_city: admission.village_town_city,
            nearby: admission.nearby,
            police_station: admission.police_station,
            post_office: admission.post_office,
            district: admission.district,
            pincode: admission.pincode,
            block: admission.block,
            state: admission.state,
            pwd_category: admission.pwd_category,
            pwd_claim: admission.pwd_claim,
            class_10th_school: admission.class_10th_school,
            class_10th_marks_obtained: admission.class_10th_marks_obtained,
            class_10th_total_marks: admission.class_10th_total_marks,
            class_10th_percentage: admission.class_10th_percentage,
            class_10th_subject: admission.class_10th_subject,
            class_12th_school: admission.class_12th_school,
            class_12th_marks_obtained: admission.class_12th_marks_obtained,
            class_12th_total_marks: admission.class_12th_total_marks,
            class_12th_percentage: admission.class_12th_percentage,
            class_12th_subject: admission.class_12th_subject,
            session: admission.session || academicYear,
            shift: admission.shift,
            mis_iti_code: 'PR10001156',
            declaration_agreed: 1
          };

          console.log('[STUDENT CREATE] Student data prepared:', JSON.stringify(studentData, null, 2));

          db.run(
            `INSERT INTO students (
              admission_id, student_name, father_name, mother_name, mobile, email,
              trade, enrollment_number, admission_date, qualification, category,
              address, photo, status, academic_year,
              uidai_number, village_town_city, nearby, police_station, post_office,
              district, pincode, block, state, pwd_category, pwd_claim,
              class_10th_school, class_10th_marks_obtained, class_10th_total_marks,
              class_10th_percentage, class_10th_subject,
              class_12th_school, class_12th_marks_obtained, class_12th_total_marks,
              class_12th_percentage, class_12th_subject,
              session, shift, mis_iti_code, declaration_agreed
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              studentData.admission_id,
              studentData.student_name,
              studentData.father_name,
              studentData.mother_name,
              studentData.mobile,
              studentData.email,
              studentData.trade,
              studentData.enrollment_number,
              studentData.admission_date,
              studentData.qualification,
              studentData.category,
              studentData.address,
              studentData.photo,
              studentData.status,
              studentData.academic_year,
              studentData.uidai_number,
              studentData.village_town_city,
              studentData.nearby,
              studentData.police_station,
              studentData.post_office,
              studentData.district,
              studentData.pincode,
              studentData.block,
              studentData.state,
              studentData.pwd_category,
              studentData.pwd_claim,
              studentData.class_10th_school,
              studentData.class_10th_marks_obtained,
              studentData.class_10th_total_marks,
              studentData.class_10th_percentage,
              studentData.class_10th_subject,
              studentData.class_12th_school,
              studentData.class_12th_marks_obtained,
              studentData.class_12th_total_marks,
              studentData.class_12th_percentage,
              studentData.class_12th_subject,
              studentData.session,
              studentData.shift,
              studentData.mis_iti_code,
              studentData.declaration_agreed
            ],
            function(err) {
              if (err) {
                console.error('Error creating student from admission:', err);
                return res.json({ 
                  message: 'Status updated successfully, but failed to create student record',
                  error: err.message 
                });
              }

              console.log(`Student record created (ID: ${this.lastID}) for approved admission ${id}`);
              res.json({ 
                message: 'Admission approved successfully! Student record created.',
                studentId: this.lastID 
              });
            }
          );
        });
      } else {
        res.json({ message: 'Status updated successfully' });
      }
    });
  });
};

// Update admission details
exports.updateAdmission = (req, res) => {
  const { id } = req.params;
  const {
    name, father_name, mother_name, mobile, email, trade, qualification, category, status,
    has_photo, has_aadhaar, has_marksheet,
    dob, gender, uidai_number, village_town_city, nearby, police_station, post_office,
    district, pincode, block, state, pwd_category, pwd_claim,
    class_10th_school, class_10th_marks_obtained, class_10th_total_marks,
    class_10th_percentage, class_10th_subject,
    class_12th_school, class_12th_marks_obtained, class_12th_total_marks,
    class_12th_percentage, class_12th_subject,
    session, shift, student_credit_card, student_credit_card_details, registration_type
  } = req.body;

  if (!name || !father_name || !mobile || !trade || !qualification || !category) {
    return res.status(400).json({ message: 'Name, father name, mobile, trade, qualification, and category are required' });
  }

  // Normalize status if provided
  let normalizedStatus = null;
  if (status) {
    const validStatuses = ['Pending', 'Approved', 'Rejected', 'pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  // First get existing admission to preserve actual document filenames
  db.get('SELECT documents FROM admissions WHERE id = ?', [id], (err, admission) => {
    if (err) {
      console.error('Error fetching admission:', err);
      return res.status(500).json({ message: 'Failed to fetch admission' });
    }

    let existingDocs = {};
    try {
      existingDocs = JSON.parse(admission?.documents || '{}');
    } catch (e) {
      existingDocs = {};
    }

    // Update documents based on YES/NO selection
    // If YES and document exists, keep it. If NO, set to null.
    // If YES but no document, set to 'manual_verified' marker
    const updatedDocs = {
      photo: has_photo ? (existingDocs.photo || 'manual_verified') : null,
      aadhaar: has_aadhaar ? (existingDocs.aadhaar || 'manual_verified') : null,
      marksheet: has_marksheet ? (existingDocs.marksheet || 'manual_verified') : null
    };

    // Build update query dynamically
    let updateQuery = `UPDATE admissions SET name = ?, father_name = ?, mother_name = ?, mobile = ?, email = ?, trade = ?, qualification = ?, category = ?, documents = ?,
      dob = ?, gender = ?, uidai_number = ?, village_town_city = ?, nearby = ?, police_station = ?, post_office = ?,
      district = ?, pincode = ?, block = ?, state = ?, pwd_category = ?, pwd_claim = ?,
      class_10th_school = ?, class_10th_marks_obtained = ?, class_10th_total_marks = ?, class_10th_percentage = ?, class_10th_subject = ?,
      class_12th_school = ?, class_12th_marks_obtained = ?, class_12th_total_marks = ?, class_12th_percentage = ?, class_12th_subject = ?,
      session = ?, shift = ?, student_credit_card = ?, student_credit_card_details = ?, registration_type = ?`;
    const params = [
      name, father_name, mother_name || null, mobile, email || null, trade, qualification, category, JSON.stringify(updatedDocs),
      dob || null, gender || null, uidai_number || null,
      village_town_city || null, nearby || null, police_station || null, post_office || null,
      district || null, pincode || null, block || null, state || null,
      pwd_category || null, pwd_claim || 'No',
      class_10th_school || null, class_10th_marks_obtained || null, class_10th_total_marks || null,
      class_10th_percentage || null, class_10th_subject || null,
      class_12th_school || null, class_12th_marks_obtained || null, class_12th_total_marks || null,
      class_12th_percentage || null, class_12th_subject || null,
      session || null, shift || null,
      student_credit_card || 'No', student_credit_card_details || null, registration_type || 'Regular'
    ];

    if (normalizedStatus) {
      updateQuery += ', status = ?';
      params.push(normalizedStatus);
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    db.run(updateQuery, params, function(err) {
      if (err) {
        console.error('Error updating admission:', err);
        return res.status(500).json({ message: 'Failed to update admission' });
      }

      // If status is being set to Approved, create student record
      if (normalizedStatus === 'Approved') {
        // Check if student already exists for this admission
        db.get('SELECT id FROM students WHERE admission_id = ?', [id], (err, existingStudent) => {
          if (err) {
            console.error('Error checking existing student:', err);
            return res.json({ message: 'Admission updated successfully, but failed to check student record' });
          }

          if (existingStudent) {
            // Update existing student record with new data
            db.run(
              `UPDATE students SET 
                student_name = ?, father_name = ?, mobile = ?, email = ?,
                trade = ?, qualification = ?, category = ?, photo = ?,
                updated_at = CURRENT_TIMESTAMP
              WHERE admission_id = ?`,
              [name, father_name, mobile, email || null, trade, qualification, category, updatedDocs.photo, id],
              (err) => {
                if (err) {
                  console.error('Error updating student:', err);
                }
                res.json({ message: 'Admission updated successfully. Student record also updated.' });
              }
            );
          } else {
            // Create new student record
            const currentYear = new Date().getFullYear();
            const academicYear = `${currentYear}-${currentYear + 1}`;

            db.run(
              `INSERT INTO students (
                admission_id, student_name, father_name, mother_name, mobile, email,
                trade, enrollment_number, admission_date, qualification, category,
                address, photo, status, academic_year
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                id, name, father_name, null, mobile, email || null,
                trade, null, new Date().toISOString().split('T')[0],
                qualification, category, null, updatedDocs.photo, 'Active', academicYear
              ],
              function(err) {
                if (err) {
                  console.error('Error creating student from admission:', err);
                  return res.json({ message: 'Admission updated successfully, but failed to create student record' });
                }
                console.log(`Student record created (ID: ${this.lastID}) for approved admission ${id}`);
                res.json({ message: 'Admission approved and updated successfully! Student record created.' });
              }
            );
          }
        });
      } else {
        res.json({ message: 'Admission updated successfully' });
      }
    });
  });
};

exports.downloadDocument = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../uploads', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  res.download(filePath);
};

// Manual admission entry
exports.createManualAdmission = (req, res) => {
  try {
    const {
      name, father_name, mother_name, mobile, email, trade, qualification, category, status,
      dob, gender, uidai_number, village_town_city, nearby, police_station, post_office,
      district, pincode, block, state, pwd_category, pwd_claim,
      class_10th_school, class_10th_marks_obtained, class_10th_total_marks,
      class_10th_percentage, class_10th_subject,
      class_12th_school, class_12th_marks_obtained, class_12th_total_marks,
      class_12th_percentage, class_12th_subject,
      session, shift, student_credit_card, student_credit_card_details, registration_type
    } = req.body;

    if (!name || !father_name || !mobile || !trade || !qualification || !category) {
      return res.status(400).json({ message: 'Name, father name, mobile, trade, qualification, and category are required' });
    }

    const documents = JSON.stringify({
      photo: null,
      aadhaar: null,
      marksheet: null,
      student_credit_card_doc: null,
    });

    const admissionStatus = status
      ? (status.charAt(0).toUpperCase() + status.slice(1).toLowerCase())
      : 'Pending';

    const regType = student_credit_card === 'Yes' ? 'Student Credit Card' : (registration_type || 'Regular');

    db.run(
      `INSERT INTO admissions (
        name, father_name, mother_name, mobile, email, trade, qualification, category, documents, status,
        dob, gender, uidai_number, village_town_city, nearby, police_station, post_office, district, pincode, block, state,
        pwd_category, pwd_claim,
        class_10th_school, class_10th_marks_obtained, class_10th_total_marks, class_10th_percentage, class_10th_subject,
        class_12th_school, class_12th_marks_obtained, class_12th_total_marks, class_12th_percentage, class_12th_subject,
        session, shift, student_credit_card, student_credit_card_details, registration_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, father_name, mother_name || null, mobile, email || null, trade, qualification, category,
        documents, admissionStatus,
        dob || null, gender || null, uidai_number || null,
        village_town_city || null, nearby || null, police_station || null, post_office || null,
        district || null, pincode || null, block || null, state || null,
        pwd_category || null, pwd_claim || 'No',
        class_10th_school || null, class_10th_marks_obtained || null, class_10th_total_marks || null,
        class_10th_percentage || null, class_10th_subject || null,
        class_12th_school || null, class_12th_marks_obtained || null, class_12th_total_marks || null,
        class_12th_percentage || null, class_12th_subject || null,
        session || null, shift || null,
        student_credit_card || 'No', student_credit_card_details || null, regType
      ],
      function (err) {
        if (err) {
          console.error('Database error creating manual admission:', err);
          return res.status(500).json({
            message: 'Failed to create admission',
            error: err.message
          });
        }

        const admissionId = this.lastID;

        if (admissionStatus === 'Approved') {
          const currentYear = new Date().getFullYear();
          const academicYear = `${currentYear}-${currentYear + 1}`;

          db.run(
            `INSERT INTO students (
              admission_id, student_name, father_name, mother_name, mobile, email,
              trade, enrollment_number, admission_date, qualification, category,
              address, photo, status, academic_year,
              dob, gender, uidai_number, village_town_city, nearby, police_station, post_office,
              district, pincode, block, state, pwd_category, pwd_claim,
              class_10th_school, class_10th_marks_obtained, class_10th_total_marks, class_10th_percentage, class_10th_subject,
              class_12th_school, class_12th_marks_obtained, class_12th_total_marks, class_12th_percentage, class_12th_subject,
              session, shift, student_credit_card, student_credit_card_details, registration_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              admissionId, name, father_name, mother_name || null, mobile, email || null,
              trade, null, new Date().toISOString().split('T')[0],
              qualification, category, null, null, 'Active', academicYear,
              dob || null, gender || null, uidai_number || null,
              village_town_city || null, nearby || null, police_station || null, post_office || null,
              district || null, pincode || null, block || null, state || null,
              pwd_category || null, pwd_claim || 'No',
              class_10th_school || null, class_10th_marks_obtained || null, class_10th_total_marks || null,
              class_10th_percentage || null, class_10th_subject || null,
              class_12th_school || null, class_12th_marks_obtained || null, class_12th_total_marks || null,
              class_12th_percentage || null, class_12th_subject || null,
              session || null, shift || null,
              student_credit_card || 'No', student_credit_card_details || null, regType
            ],
            function(err) {
              if (err) {
                console.error('Error creating student from manual admission:', err);
                return res.json({
                  message: 'Admission created successfully, but failed to create student record',
                  applicationId: admissionId,
                });
              }
              res.json({
                message: 'Admission created and approved! Student record created.',
                applicationId: admissionId,
                studentId: this.lastID
              });
            }
          );
        } else {
          res.json({
            message: 'Admission created successfully',
            applicationId: admissionId,
          });
        }
      }
    );
  } catch (error) {
    console.error('Unexpected error in createManualAdmission:', error);
    return res.status(500).json({
      message: 'Failed to create admission',
      error: error.message
    });
  }
};
