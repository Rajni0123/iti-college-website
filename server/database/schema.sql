-- ============================================================
-- ITI Website - Database Schema (SQLite)
-- Generated from server/database/db.js
-- Run: sqlite3 database.sqlite < schema.sql
-- ============================================================

-- Users (admin login)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  avatar TEXT,
  role TEXT DEFAULT 'admin',
  permissions TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Students
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admission_id INTEGER,
  student_name TEXT NOT NULL,
  father_name TEXT,
  mother_name TEXT,
  mobile TEXT NOT NULL,
  email TEXT,
  trade TEXT NOT NULL,
  enrollment_number TEXT UNIQUE,
  admission_date TEXT,
  qualification TEXT,
  category TEXT,
  address TEXT,
  photo TEXT,
  status TEXT DEFAULT 'Active',
  academic_year TEXT,
  uidai_number TEXT,
  village_town_city TEXT,
  nearby TEXT,
  police_station TEXT,
  post_office TEXT,
  district TEXT,
  pincode TEXT,
  block TEXT,
  state TEXT,
  pwd_category TEXT,
  pwd_claim TEXT,
  class_10th_school TEXT,
  class_10th_marks_obtained TEXT,
  class_10th_total_marks TEXT,
  class_10th_percentage TEXT,
  class_10th_subject TEXT,
  class_12th_school TEXT,
  class_12th_marks_obtained TEXT,
  class_12th_total_marks TEXT,
  class_12th_percentage TEXT,
  class_12th_subject TEXT,
  session TEXT,
  shift TEXT,
  mis_iti_code TEXT DEFAULT 'PR10001156',
  declaration_agreed INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admission_id) REFERENCES admissions(id)
);

-- Notices
CREATE TABLE IF NOT EXISTS notices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  pdf TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Results
CREATE TABLE IF NOT EXISTS results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  trade TEXT NOT NULL,
  year TEXT NOT NULL,
  pdf TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_name TEXT NOT NULL UNIQUE,
  start_year INTEGER NOT NULL,
  end_year INTEGER NOT NULL,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Admissions
CREATE TABLE IF NOT EXISTS admissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  father_name TEXT NOT NULL,
  mother_name TEXT,
  mobile TEXT NOT NULL,
  email TEXT,
  trade TEXT NOT NULL,
  qualification TEXT NOT NULL,
  category TEXT NOT NULL,
  documents TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  uidai_number TEXT,
  village_town_city TEXT,
  nearby TEXT,
  police_station TEXT,
  post_office TEXT,
  district TEXT,
  pincode TEXT,
  block TEXT,
  state TEXT,
  pwd_category TEXT,
  pwd_claim TEXT DEFAULT 'No',
  class_10th_school TEXT,
  class_10th_marks_obtained TEXT,
  class_10th_total_marks TEXT,
  class_10th_percentage TEXT,
  class_10th_subject TEXT,
  class_12th_school TEXT,
  class_12th_marks_obtained TEXT,
  class_12th_total_marks TEXT,
  class_12th_percentage TEXT,
  class_12th_subject TEXT,
  session TEXT,
  shift TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Contact
CREATE TABLE IF NOT EXISTS contact (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Site Settings (key-value)
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Menus (navigation)
CREATE TABLE IF NOT EXISTS menus (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  parent_id INTEGER,
  order_index INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories (gallery/content)
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id INTEGER,
  order_index INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Hero Section
CREATE TABLE IF NOT EXISTS hero_section (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  background_image TEXT,
  cta_text TEXT,
  cta_link TEXT,
  cta2_text TEXT,
  cta2_link TEXT,
  is_active INTEGER DEFAULT 1,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Student Fees
CREATE TABLE IF NOT EXISTS student_fees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admission_id INTEGER,
  student_name TEXT NOT NULL,
  father_name TEXT,
  mobile TEXT,
  trade TEXT NOT NULL,
  fee_type TEXT NOT NULL,
  total_amount REAL,
  amount REAL NOT NULL,
  paid_amount REAL DEFAULT 0,
  due_date TEXT,
  status TEXT DEFAULT 'Pending',
  payment_date TEXT,
  payment_method TEXT,
  receipt_number TEXT,
  invoice_number TEXT,
  notes TEXT,
  installment_enabled INTEGER DEFAULT 0,
  total_installments INTEGER DEFAULT 1,
  academic_year TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admission_id) REFERENCES admissions(id)
);

-- Fee Installments
CREATE TABLE IF NOT EXISTS fee_installments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fee_id INTEGER NOT NULL,
  installment_number INTEGER NOT NULL,
  amount REAL NOT NULL,
  due_date TEXT,
  paid_amount REAL DEFAULT 0,
  payment_date TEXT,
  payment_method TEXT,
  receipt_number TEXT,
  status TEXT DEFAULT 'Pending',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fee_id) REFERENCES student_fees(id) ON DELETE CASCADE
);

-- Flash News
CREATE TABLE IF NOT EXISTS flash_news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  link TEXT,
  is_active INTEGER DEFAULT 1,
  order_index INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Header Settings
CREATE TABLE IF NOT EXISTS header_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT,
  email TEXT,
  student_portal_link TEXT,
  student_portal_text TEXT,
  ncvt_mis_link TEXT,
  ncvt_mis_text TEXT,
  staff_email_link TEXT,
  staff_email_text TEXT,
  logo_text TEXT,
  tagline TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Footer Settings
CREATE TABLE IF NOT EXISTS footer_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  about_text TEXT,
  facebook_link TEXT,
  twitter_link TEXT,
  linkedin_link TEXT,
  youtube_link TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  copyright_text TEXT,
  privacy_link TEXT,
  terms_link TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Footer Links
CREATE TABLE IF NOT EXISTS footer_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT DEFAULT 'quick_links',
  order_index INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Trades
CREATE TABLE IF NOT EXISTS trades (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  syllabus_pdf TEXT,
  prospectus_pdf TEXT,
  duration TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  seats TEXT NOT NULL,
  syllabus_json TEXT,
  careers_json TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- About Page (CMS)
CREATE TABLE IF NOT EXISTS about_page (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT,
  hero_description TEXT,
  hero_image TEXT,
  about_title TEXT,
  about_description TEXT,
  about_image TEXT,
  mission_title TEXT,
  mission_description TEXT,
  vision_title TEXT,
  vision_description TEXT,
  principal_name TEXT,
  principal_message TEXT,
  principal_image TEXT,
  stats_json TEXT,
  values_json TEXT,
  features_json TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Admission Process (CMS)
CREATE TABLE IF NOT EXISTS admission_process (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT,
  hero_description TEXT,
  eligibility_title TEXT,
  eligibility_criteria_json TEXT,
  steps_title TEXT,
  steps_json TEXT,
  dates_title TEXT,
  important_dates_json TEXT,
  documents_title TEXT,
  required_documents_json TEXT,
  cta_title TEXT,
  cta_description TEXT,
  cta_button_text TEXT,
  cta_button_link TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Faculty
CREATE TABLE IF NOT EXISTS faculty (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  department TEXT NOT NULL,
  qualification TEXT,
  experience TEXT,
  image TEXT,
  email TEXT,
  phone TEXT,
  bio TEXT,
  specialization TEXT,
  is_principal INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Default / Seed Data (optional - run after tables exist)
-- ============================================================

-- Default admin user: email admin@iticollege.edu, password admin123
-- Password must be bcrypt hashed - create via Node: bcrypt.hashSync('admin123', 10)
-- Or use PHP: password_hash('admin123', PASSWORD_DEFAULT)

-- Default menus
INSERT OR IGNORE INTO menus (title, url, icon, parent_id, order_index, is_active) VALUES
  ('Home', '/', NULL, NULL, 1, 1),
  ('About', '/about', NULL, NULL, 2, 1),
  ('Trades', '/trades', NULL, NULL, 3, 1),
  ('Admission', '/admission-process', NULL, NULL, 4, 1),
  ('Results', '/results', NULL, NULL, 5, 1),
  ('Faculty', '/faculty', NULL, NULL, 6, 1),
  ('Gallery', '/infrastructure', NULL, NULL, 7, 1),
  ('Contact', '/contact', NULL, NULL, 8, 1);

-- Default header settings
INSERT OR IGNORE INTO header_settings (phone, email, student_portal_link, student_portal_text, ncvt_mis_link, ncvt_mis_text, staff_email_link, staff_email_text, logo_text, tagline)
SELECT '+91-9155401839', 'manerpvtiti@gmail.com', '#', 'Student Portal', 'https://ncvtmis.gov.in', 'NCVT MIS', '#', 'Staff Email', 'Maner Pvt ITI', 'Skill India | Digital India'
WHERE NOT EXISTS (SELECT 1 FROM header_settings LIMIT 1);

-- Default footer settings
INSERT OR IGNORE INTO footer_settings (about_text, facebook_link, twitter_link, linkedin_link, youtube_link, address, phone, email, copyright_text, privacy_link, terms_link)
SELECT 'A premier private institute for vocational training.', '#', '#', '#', '#', 'Maner, Mahinawan, Near Vishwakarma Mandir, Maner, Patna - 801108', '+91-9155401839', 'manerpvtiti@gmail.com', '© 2024 Maner Pvt ITI. All Rights Reserved.', '#', '#'
WHERE NOT EXISTS (SELECT 1 FROM footer_settings LIMIT 1);

-- Default site settings
INSERT OR IGNORE INTO site_settings (setting_key, setting_value) VALUES
  ('header_text', 'Admission Open for the Academic Session 2024-25. Apply now to secure your seat in Electrician and Fitter trades.'),
  ('principal_name', 'Dr. Rajesh Kumar'),
  ('principal_message', 'Welcome to Maner Pvt ITI, a premier institution committed to providing quality vocational training.'),
  ('credit_card_enabled', 'true'),
  ('credit_card_title', 'Student Credit Card Facility Available'),
  ('credit_card_description', 'Get financial support through Bihar Student Credit Card Scheme. Apply for interest-free loans up to ₹4 Lakhs for your technical education.');
