const { getDb } = require('../database/db');
const db = getDb();

// Get about page content
exports.getAbout = (req, res) => {
  console.log('[GET /api/about] Fetching about page content...');
  db.get('SELECT * FROM about_page ORDER BY id DESC LIMIT 1', [], (err, about) => {
    if (err) {
      console.error('[GET /api/about] Database error:', err.message);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to fetch about page', 
        error: err.message 
      });
    }
    
    if (!about) {
      return res.json({
        hero_title: 'Shaping Futures Through',
        hero_subtitle: 'Technical Excellence',
        hero_description: 'Maner Pvt ITI is a premier institution committed to providing quality vocational training.',
        about_title: 'About Maner Pvt ITI',
        about_description: 'Maner Pvt ITI has been a pioneer in technical education.',
        mission_title: 'Our Mission',
        mission_description: 'To provide quality technical education.',
        vision_title: 'Our Vision',
        vision_description: 'To become a leading institution in technical education.',
        stats_json: [],
        values_json: [],
        features_json: []
      });
    }
    
    // Parse JSON fields
    try {
      const parsedAbout = {
        ...about,
        stats_json: about.stats_json ? JSON.parse(about.stats_json) : [],
        values_json: about.values_json ? JSON.parse(about.values_json) : [],
        features_json: about.features_json ? JSON.parse(about.features_json) : []
      };
      console.log('[GET /api/about] Successfully fetched about page content');
      res.json(parsedAbout);
    } catch (parseErr) {
      console.error('[GET /api/about] Error parsing JSON:', parseErr.message);
      res.json({
        ...about,
        stats_json: [],
        values_json: [],
        features_json: []
      });
    }
  });
};

// Update about page content
exports.updateAbout = (req, res) => {
  console.log('[PUT /api/about] Updating about page content...');
  console.log('[PUT /api/about] Request body:', req.body);
  
  const {
    hero_title,
    hero_subtitle,
    hero_description,
    hero_image,
    about_title,
    about_description,
    about_image,
    mission_title,
    mission_description,
    vision_title,
    vision_description,
    principal_name,
    principal_message,
    principal_image,
    stats_json,
    values_json,
    features_json
  } = req.body;

  // Validate JSON fields if provided
  let parsedStatsJson = null;
  let parsedValuesJson = null;
  let parsedFeaturesJson = null;
  
  if (stats_json) {
    try {
      parsedStatsJson = typeof stats_json === 'string' ? JSON.parse(stats_json) : stats_json;
    } catch (parseErr) {
      console.error('[PUT /api/about] Invalid stats_json format:', parseErr.message);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid stats_json format' 
      });
    }
  }
  
  if (values_json) {
    try {
      parsedValuesJson = typeof values_json === 'string' ? JSON.parse(values_json) : values_json;
    } catch (parseErr) {
      console.error('[PUT /api/about] Invalid values_json format:', parseErr.message);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid values_json format' 
      });
    }
  }
  
  if (features_json) {
    try {
      parsedFeaturesJson = typeof features_json === 'string' ? JSON.parse(features_json) : features_json;
    } catch (parseErr) {
      console.error('[PUT /api/about] Invalid features_json format:', parseErr.message);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid features_json format' 
      });
    }
  }

  // Check if about page exists
  db.get('SELECT id FROM about_page LIMIT 1', [], (err, existing) => {
    if (err) {
      console.error('[PUT /api/about] Error checking existing about page:', err.message);
      return res.status(500).json({ 
        success: false,
        message: 'Database error', 
        error: err.message 
      });
    }

    if (existing) {
      // Update existing
      db.run(
        `UPDATE about_page SET 
          hero_title = ?, hero_subtitle = ?, hero_description = ?, hero_image = ?,
          about_title = ?, about_description = ?, about_image = ?,
          mission_title = ?, mission_description = ?,
          vision_title = ?, vision_description = ?,
          principal_name = ?, principal_message = ?, principal_image = ?,
          stats_json = ?, values_json = ?, features_json = ?,
          updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
        [
          hero_title,
          hero_subtitle,
          hero_description,
          hero_image || null,
          about_title,
          about_description,
          about_image || null,
          mission_title,
          mission_description,
          vision_title,
          vision_description,
          principal_name,
          principal_message,
          principal_image || null,
          parsedStatsJson ? JSON.stringify(parsedStatsJson) : null,
          parsedValuesJson ? JSON.stringify(parsedValuesJson) : null,
          parsedFeaturesJson ? JSON.stringify(parsedFeaturesJson) : null,
          existing.id
        ],
        (err) => {
          if (err) {
            console.error('[PUT /api/about] Database error:', err.message);
            return res.status(500).json({ 
              success: false,
              message: 'Failed to update about page', 
              error: err.message 
            });
          }
          console.log('[PUT /api/about] Successfully updated about page');
          res.json({ 
            success: true,
            message: 'About page updated successfully' 
          });
        }
      );
    } else {
      // Create new
      db.run(
        `INSERT INTO about_page (
          hero_title, hero_subtitle, hero_description, hero_image,
          about_title, about_description, about_image,
          mission_title, mission_description,
          vision_title, vision_description,
          principal_name, principal_message, principal_image,
          stats_json, values_json, features_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          hero_title,
          hero_subtitle,
          hero_description,
          hero_image || null,
          about_title,
          about_description,
          about_image || null,
          mission_title,
          mission_description,
          vision_title,
          vision_description,
          principal_name,
          principal_message,
          principal_image || null,
          parsedStatsJson ? JSON.stringify(parsedStatsJson) : null,
          parsedValuesJson ? JSON.stringify(parsedValuesJson) : null,
          parsedFeaturesJson ? JSON.stringify(parsedFeaturesJson) : null
        ],
        function (err) {
          if (err) {
            console.error('[PUT /api/about] Database error:', err.message);
            return res.status(500).json({ 
              success: false,
              message: 'Failed to create about page', 
              error: err.message 
            });
          }
          console.log('[PUT /api/about] Successfully created about page');
          res.json({ 
            success: true,
            id: this.lastID,
            message: 'About page created successfully' 
          });
        }
      );
    }
  });
};
