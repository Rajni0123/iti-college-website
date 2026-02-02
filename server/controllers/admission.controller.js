const { getDb } = require('../database/db');
const db = getDb();

// Check if UIDAI number is already registered
exports.checkUidaiAvailability = (req, res) => {
  const { uidai } = req.params;

  // Check in admissions table
  db.get('SELECT id FROM admissions WHERE uidai_number = ?', [uidai], (err, admission) => {
    if (err) {
      console.error('Error checking UIDAI in admissions:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (admission) {
      return res.status(400).json({ 
        available: false,
        message: 'This UIDAI/Aadhaar number is already registered. Each UIDAI number can only be used once.'
      });
    }

    // Check in students table
    db.get('SELECT id FROM students WHERE uidai_number = ?', [uidai], (err, student) => {
      if (err) {
        console.error('Error checking UIDAI in students:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (student) {
        return res.status(400).json({ 
          available: false,
          message: 'This UIDAI/Aadhaar number is already registered in student records.'
        });
      }

      // UIDAI is available
      res.json({ 
        available: true,
        message: 'UIDAI number is available'
      });
    });
  });
};

exports.applyAdmission = (req, res) => {
  const {
    name, father_name, mother_name, mobile, email, trade, category,
    uidai_number, village_town_city, nearby, police_station, post_office,
    district, pincode, block, state, pwd_category, pwd_claim,
    class_10th_school, class_10th_marks_obtained, class_10th_total_marks,
    class_10th_percentage, class_10th_subject,
    class_12th_school, class_12th_marks_obtained, class_12th_total_marks,
    class_12th_percentage, class_12th_subject,
    session, shift, declaration, dob, gender,
    student_credit_card, student_credit_card_details, registration_type
  } = req.body;
  const files = req.files;

  if (!files || !files.photo || !files.aadhaar || !files.marksheet) {
    return res.status(400).json({ message: 'All documents are required' });
  }

  // Check for duplicate UIDAI number in admissions table
  db.get(
    'SELECT id FROM admissions WHERE uidai_number = ?',
    [uidai_number],
    (err, existingAdmission) => {
      if (err) {
        console.error('Error checking UIDAI in admissions:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (existingAdmission) {
        return res.status(400).json({ 
          message: 'This UIDAI/Aadhaar number is already registered. Each UIDAI number can only be used once.',
          field: 'uidai_number'
        });
      }

      // Check for duplicate UIDAI number in students table
      db.get(
        'SELECT id FROM students WHERE uidai_number = ?',
        [uidai_number],
        (err, existingStudent) => {
          if (err) {
            console.error('Error checking UIDAI in students:', err);
            return res.status(500).json({ message: 'Database error' });
          }

          if (existingStudent) {
            return res.status(400).json({ 
              message: 'This UIDAI/Aadhaar number is already registered in our student records. Each UIDAI number can only be used once.',
              field: 'uidai_number'
            });
          }

          // No duplicate found, proceed with insertion
          const documents = {
            photo: files.photo[0].filename,
            aadhaar: files.aadhaar[0].filename,
            marksheet: files.marksheet[0].filename,
            student_credit_card_doc: files.student_credit_card_doc ? files.student_credit_card_doc[0].filename : null,
          };

          // Construct qualification summary from 10th details
          const qualification = class_10th_school ? `10th from ${class_10th_school}` : 'Not specified';

          // Determine registration type based on student credit card selection
          const regType = student_credit_card === 'Yes' ? 'Student Credit Card' : 'Regular';

          db.run(
            `INSERT INTO admissions (
              name, father_name, mother_name, mobile, email, trade, qualification, category, documents, status,
              uidai_number, village_town_city, nearby, police_station, post_office, district, pincode, block, state,
              pwd_category, pwd_claim,
              class_10th_school, class_10th_marks_obtained, class_10th_total_marks, class_10th_percentage, class_10th_subject,
              class_12th_school, class_12th_marks_obtained, class_12th_total_marks, class_12th_percentage, class_12th_subject,
              session, shift, dob, gender, student_credit_card, student_credit_card_details, registration_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              name, father_name, mother_name || null, mobile, email || null, trade, qualification, category,
              JSON.stringify(documents), 'Pending',
              uidai_number || null, village_town_city || null, nearby || null, police_station || null,
              post_office || null, district || null, pincode || null, block || null, state || null,
              pwd_category || null, pwd_claim || 'No',
              class_10th_school || null, class_10th_marks_obtained || null, class_10th_total_marks || null,
              class_10th_percentage || null, class_10th_subject || null,
              class_12th_school || null, class_12th_marks_obtained || null, class_12th_total_marks || null,
              class_12th_percentage || null, class_12th_subject || null,
              session || null, shift || null, dob || null, gender || null,
              student_credit_card || 'No', student_credit_card_details || null, regType
            ],
            function (err) {
              if (err) {
                console.error('Error submitting admission:', err);
                return res.status(500).json({ message: 'Failed to submit application', error: err.message });
              }
              res.json({
                message: 'Application submitted successfully',
                applicationId: this.lastID,
              });
            }
          );
        }
      );
    }
  );
};
