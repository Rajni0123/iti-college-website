const { getDb } = require('../database/db');
const db = getDb();

// Get admission process content
exports.getAdmissionProcess = (req, res) => {
  console.log('[GET /api/admission-process] Fetching admission process content...');
  db.get('SELECT * FROM admission_process ORDER BY id DESC LIMIT 1', [], (err, data) => {
    if (err) {
      console.error('[GET /api/admission-process] Database error:', err.message);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to fetch admission process', 
        error: err.message 
      });
    }
    
    if (!data) {
      return res.json({
        hero_title: 'Admission Process',
        hero_subtitle: 'Your Journey to Technical Excellence Starts Here',
        eligibility_title: 'Eligibility Criteria',
        steps_title: 'Admission Steps',
        dates_title: 'Important Dates',
        documents_title: 'Required Documents',
        eligibility_criteria_json: [],
        steps_json: [],
        important_dates_json: [],
        required_documents_json: []
      });
    }
    
    // Parse JSON fields
    try {
      const parsedData = {
        ...data,
        eligibility_criteria_json: data.eligibility_criteria_json ? JSON.parse(data.eligibility_criteria_json) : [],
        steps_json: data.steps_json ? JSON.parse(data.steps_json) : [],
        important_dates_json: data.important_dates_json ? JSON.parse(data.important_dates_json) : [],
        required_documents_json: data.required_documents_json ? JSON.parse(data.required_documents_json) : []
      };
      console.log('[GET /api/admission-process] Successfully fetched admission process content');
      res.json(parsedData);
    } catch (parseErr) {
      console.error('[GET /api/admission-process] Error parsing JSON:', parseErr.message);
      res.json({
        ...data,
        eligibility_criteria_json: [],
        steps_json: [],
        important_dates_json: [],
        required_documents_json: []
      });
    }
  });
};

// Update admission process content
exports.updateAdmissionProcess = (req, res) => {
  console.log('[PUT /api/admission-process] Updating admission process content...');
  console.log('[PUT /api/admission-process] Request body:', req.body);
  
  const {
    hero_title,
    hero_subtitle,
    hero_description,
    eligibility_title,
    eligibility_criteria_json,
    steps_title,
    steps_json,
    dates_title,
    important_dates_json,
    documents_title,
    required_documents_json,
    cta_title,
    cta_description,
    cta_button_text,
    cta_button_link
  } = req.body;

  // Validate JSON fields if provided
  let parsedEligibility = null;
  let parsedSteps = null;
  let parsedDates = null;
  let parsedDocuments = null;
  
  if (eligibility_criteria_json) {
    try {
      parsedEligibility = typeof eligibility_criteria_json === 'string' ? JSON.parse(eligibility_criteria_json) : eligibility_criteria_json;
    } catch (parseErr) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid eligibility_criteria_json format' 
      });
    }
  }
  
  if (steps_json) {
    try {
      parsedSteps = typeof steps_json === 'string' ? JSON.parse(steps_json) : steps_json;
    } catch (parseErr) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid steps_json format' 
      });
    }
  }
  
  if (important_dates_json) {
    try {
      parsedDates = typeof important_dates_json === 'string' ? JSON.parse(important_dates_json) : important_dates_json;
    } catch (parseErr) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid important_dates_json format' 
      });
    }
  }
  
  if (required_documents_json) {
    try {
      parsedDocuments = typeof required_documents_json === 'string' ? JSON.parse(required_documents_json) : required_documents_json;
    } catch (parseErr) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid required_documents_json format' 
      });
    }
  }

  // Check if admission process exists
  db.get('SELECT id FROM admission_process LIMIT 1', [], (err, existing) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: 'Database error', 
        error: err.message 
      });
    }

    if (existing) {
      // Update existing
      db.run(
        `UPDATE admission_process SET 
          hero_title = ?, hero_subtitle = ?, hero_description = ?,
          eligibility_title = ?, eligibility_criteria_json = ?,
          steps_title = ?, steps_json = ?,
          dates_title = ?, important_dates_json = ?,
          documents_title = ?, required_documents_json = ?,
          cta_title = ?, cta_description = ?, cta_button_text = ?, cta_button_link = ?,
          updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
        [
          hero_title,
          hero_subtitle,
          hero_description,
          eligibility_title,
          parsedEligibility ? JSON.stringify(parsedEligibility) : null,
          steps_title,
          parsedSteps ? JSON.stringify(parsedSteps) : null,
          dates_title,
          parsedDates ? JSON.stringify(parsedDates) : null,
          documents_title,
          parsedDocuments ? JSON.stringify(parsedDocuments) : null,
          cta_title,
          cta_description,
          cta_button_text,
          cta_button_link,
          existing.id
        ],
        (err) => {
          if (err) {
            console.error('[PUT /api/admission-process] Database error:', err.message);
            return res.status(500).json({ 
              success: false,
              message: 'Failed to update admission process', 
              error: err.message 
            });
          }
          console.log('[PUT /api/admission-process] Successfully updated admission process');
          res.json({ 
            success: true,
            message: 'Admission process updated successfully' 
          });
        }
      );
    } else {
      // Create new
      db.run(
        `INSERT INTO admission_process (
          hero_title, hero_subtitle, hero_description,
          eligibility_title, eligibility_criteria_json,
          steps_title, steps_json,
          dates_title, important_dates_json,
          documents_title, required_documents_json,
          cta_title, cta_description, cta_button_text, cta_button_link
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          hero_title,
          hero_subtitle,
          hero_description,
          eligibility_title,
          parsedEligibility ? JSON.stringify(parsedEligibility) : null,
          steps_title,
          parsedSteps ? JSON.stringify(parsedSteps) : null,
          dates_title,
          parsedDates ? JSON.stringify(parsedDates) : null,
          documents_title,
          parsedDocuments ? JSON.stringify(parsedDocuments) : null,
          cta_title,
          cta_description,
          cta_button_text,
          cta_button_link
        ],
        function (err) {
          if (err) {
            console.error('[PUT /api/admission-process] Database error:', err.message);
            return res.status(500).json({ 
              success: false,
              message: 'Failed to create admission process', 
              error: err.message 
            });
          }
          console.log('[PUT /api/admission-process] Successfully created admission process');
          res.json({ 
            success: true,
            id: this.lastID,
            message: 'Admission process created successfully' 
          });
        }
      );
    }
  });
};
