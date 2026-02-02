# Product Requirements Document (PRD)
## Maner Pvt ITI – College Website

**Version:** 1.0  
**Last Updated:** February 2025  
**Scope:** Full website – layout, frontend, backend, user-side & admin-side features.

---

### Table of Contents
1. [Product Overview](#1-product-overview)  
2. [Layout & Design](#2-layout--design)  
3. [User-Side Features](#3-user-side-public-features)  
4. [Admin-Side Features](#4-admin-side-features)  
5. [Backend (API) Specification](#5-backend-api-specification)  
6. [Database Entities](#6-database-sqlite--main-entities)  
7. [Security & Auth](#7-security--auth)  
8. [Non-Functional Requirements](#8-non-functional-requirements)  
9. [File / Folder Reference](#9-file--folder-reference-high-level)  
10. [Summary Checklist](#10-summary-checklist)

---

## 1. Product Overview

### 1.1 Purpose
Official website for **Maner Pvt ITI** (Industrial Training Institute): public-facing information, admissions, notices, results, faculty, gallery; and an admin panel to manage all content, admissions, fees, staff, and students.

### 1.2 Target Users
- **Public:** Students, parents, visitors (browse courses, apply, contact, view notices/results).
- **Admin:** Institute staff (content management, admissions, fees, staff/student records).

### 1.3 Tech Stack

| Layer      | Technology |
|-----------|------------|
| Frontend  | React 19, Vite 7, React Router 7, Tailwind CSS, Lucide React, Axios, React Hot Toast |
| Backend   | Node.js, Express 4 |
| Database  | SQLite (server/database/database.sqlite) |
| Auth      | JWT (Bearer), bcrypt for passwords |
| File storage | Local (server/uploads/) |

---

## 2. Layout & Design

### 2.1 Public Site Layout
- **Wrapper:** Max width 1400px, centered; white/dark content area with shadow.
- **Top bar (utility):** Blue (#195de6); phone, email, Student Portal link, PR Code (PR10001156).
- **Header (sticky):**
  - Logo block (icon + institute name + tagline).
  - Desktop: Horizontal nav (dynamic from DB – menus table).
  - Mobile: Hamburger menu with full nav.
  - NCVT / Skill India logos (right).
- **Main:** Full-width content area; per-page sections.
- **Footer (dark #0e121b):**
  - Column 1: Logo, about text, social links (Facebook, Twitter, LinkedIn, YouTube).
  - Column 2: Quick Links (from footer_links, category quick_links).
  - Column 3: Govt. Portals (footer_links, category govt_portals).
  - Column 4: Contact (address, phone, email).
  - Bottom: Copyright, Privacy, Terms, Accessibility.

### 2.2 Admin Layout
- **Sidebar/top nav:** Logo, menu items (Dashboard, Notices, Results, Gallery, Admissions, Staff, Students, Sessions, Settings, Menus, Categories, Flash News, Hero, Profile, Fees, Header/Footer, Trades, About, Admission Process, Faculty), user menu, logout.
- **Content area:** Page-specific tables, forms, filters.

### 2.3 Design System
- **Primary:** #195de6 (blue).
- **Typography:** Public Sans, Inter, Playfair Display (from index.html).
- **Components:** Cards, bordered sections, badges, buttons; responsive grid (Tailwind).

---

## 3. User-Side (Public) Features

### 3.1 Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, flash news, quick links, credit card banner, “Why Choose Us”, trades preview, latest notices, principal message |
| `/about` | About | Hero, stats, about text, mission/vision, values, features, principal message, CTA |
| `/trades` | Trades | List of NCVT trades; cards with image, duration, eligibility, seats; CTA |
| `/trades/:tradeId` | Trade Detail | Breadcrumb, hero, duration/eligibility/seats, syllabus (accordion), career opportunities, sidebar (contact, other trades), syllabus PDF download |
| `/admission-process` | Admission Process | Hero, eligibility criteria, steps, important dates, required documents, CTA to apply |
| `/apply-admission` | Apply Admission | Multi-step form: personal details, address, 10th/12th, UIDAI, documents (photo, Aadhaar, marksheet), session/shift, declaration; submit to API |
| `/fee-structure` | Fee Structure | Table of trades vs fees; optional fee-structure PDF; additional info (installments, SC/ST, refund) |
| `/faculty` | Faculty | Principal card; faculty grid (image, name, designation, department, qualification, bio) |
| `/infrastructure` | Infrastructure / Gallery | Facilities list; gallery grid (images from API) |
| `/notices` | Notice Board | List of notices (date, title, description, PDF link) |
| `/results` | Results | Filters (trade, year); list of results with PDF download |
| `/contact` | Contact | Contact info (address, phone, email), map iframe, contact form (name, email, phone, message); submit to API |
| `*` | 404 | Layout + “Page Not Found” + link to home |

### 3.2 User-Side Features (Detail)

- **Dynamic nav:** Menus from API (`/menus`); active item highlight; external links open in new tab.
- **Flash news:** Marquee from flash_news API or site settings header text.
- **Hero (home):** Title, subtitle, description, background image, CTA buttons from `/hero`.
- **Notices:** Latest 3 on home; full list on `/notices`; PDF from `/uploads/`.
- **Principal message:** Settings (principal_name, principal_message, principal_image) on home and about.
- **Trades:** From `/trades`; detail from `/trades/:slug`; syllabus JSON (accordion), careers JSON.
- **Contact form:** POST `/contact`; success/error toast.
- **Admission form:** POST `/admissions` (multipart); UIDAI check; file uploads (photo, Aadhaar, marksheet); success/error; optional print view.
- **SEO:** SEOHead component updates title/meta from `/settings` (if available).
- **Responsive:** Layout, nav, and content responsive (Tailwind breakpoints).

---

## 4. Admin-Side Features

### 4.1 Auth
- **Login:** `/admin/login` – email + password; POST `/api/admin/login`; JWT stored (e.g. localStorage as adminToken).
- **Protected routes:** All `/admin/*` (except login) require valid JWT; else redirect to login.
- **Logout:** Clear token; redirect to admin login.

### 4.2 Admin Modules & Routes

| Route | Module | Features |
|-------|--------|----------|
| `/admin` | Dashboard | Stats (notices, results, gallery, pending/approved admissions); recent admissions; quick links |
| `/admin/notices` | Notices | List notices; Create (title, description, PDF upload); Edit; Delete |
| `/admin/results` | Results | List results; Create (title, trade, year, PDF); Delete |
| `/admin/gallery` | Gallery | List images; Upload (image + category); Delete |
| `/admin/admissions` | Admissions | List with filters (status, search); View detail; Update status (Pending/Approved/Rejected); Edit; Manual add; Download documents; Print form |
| `/admin/staff` | Staff | List staff; Create/Edit/Delete; permissions (optional) |
| `/admin/students` | Students | List with filters; Create/Edit/Delete; high-dues list |
| `/admin/sessions` | Sessions | List sessions; Create/Edit (session_name, start_year, end_year, is_active) |
| `/admin/settings` | Settings | Site settings (header text, principal name/message/image, credit card toggle/title/description); Fee structure PDF upload; Favicon upload |
| `/admin/menus` | Menus | List nav menus; Create/Edit/Delete (title, url, order, is_active); Seed default |
| `/admin/categories` | Categories | List categories; Create/Edit/Delete (name, slug, description, order) |
| `/admin/flash-news` | Flash News | List; Create/Edit/Delete (title, content, link, order, is_active) |
| `/admin/hero` | Hero | List hero slides; Create/Edit/Delete (title, subtitle, description, background_image, CTAs); reorder |
| `/admin/profile` | Profile | View/Edit profile (name, email, phone, avatar); Change password |
| `/admin/fees` | Fees | List fees (filters); Create/Edit/Delete; record payment; installments; recent payments |
| `/admin/header-footer` | Header/Footer | Edit header (phone, email, logo text, tagline, links); Edit footer (about, social, address, phone, email, copyright, privacy, terms); Manage footer links (quick_links, govt_portals) |
| `/admin/trades` | Trades | List all trades; Create/Edit/Delete (name, slug, category, description, image, syllabus PDF, prospectus, duration, eligibility, seats, syllabus_json, careers_json) |
| `/admin/about` | About | Edit about page (hero, about block, mission, vision, principal, stats_json, values_json, features_json) |
| `/admin/admission-process` | Admission Process | Edit (hero, eligibility JSON, steps JSON, dates JSON, documents JSON, CTA) |
| `/admin/faculty` | Faculty | List faculty; Create/Edit/Delete; set principal; display order |

### 4.3 Admin Features (Detail)
- **Dashboard:** Stats from `/admin/stats`; recent admissions from API.
- **File uploads:** Notices (PDF), Results (PDF), Gallery (image), Hero (image), Trades (image, syllabus PDF, prospectus PDF), Settings (fee-structure PDF, favicon), Profile (avatar); multipart/form-data to API.
- **Admissions:** Pagination, status filter, search; view full application; approve/reject; edit; add manual; download document by filename.
- **Fees:** Create fee (student, trade, amount, type, due date, installments); mark payment (amount, method, receipt); list with filters.
- **Staff/Students:** CRUD; students linked to admissions; high-dues report for students.
- **Sessions:** Used in admission form and fee/session filters.
- **Menus:** Order; internal vs external URL; active flag.
- **Footer links:** Category = quick_links or govt_portals; order.
- **Trades:** syllabus_json (syllabus accordion), careers_json (career cards).
- **About / Admission Process:** Rich JSON fields for sections; single “page” record per entity.

---

## 5. Backend (API) Specification

### 5.1 Base
- **Base URL:** `VITE_API_URL` (e.g. `http://localhost:5000/api`).
- **Auth:** `Authorization: Bearer <token>` for admin/protected routes.
- **Uploads:** Served at `/uploads/` (e.g. same origin or configured base).

### 5.2 Public Endpoints (no auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /notices | List notices |
| GET | /notices/:id | Single notice |
| GET | /results | List results |
| GET | /gallery | List gallery images |
| POST | /contact | Submit contact form |
| POST | /admissions | Submit admission form (multipart) |
| GET | /menus | List active menus |
| GET | /categories | List categories |
| GET | /hero | Active hero (first) |
| GET | /flash-news | Active flash news |
| GET | /settings | Site settings (key-value) |
| GET | /site/header | Header settings |
| GET | /site/footer | Footer settings + links |
| GET | /trades | List active trades |
| GET | /trades/:slug | Trade by slug |
| GET | /about | About page content |
| GET | /admission-process | Admission process content |
| GET | /faculty | List active faculty |
| GET | /faculty/principal | Principal |
| GET | /sessions/active | Active sessions |
| GET | /fees | List fees (optional filters) |
| GET | /settings/fee-structure/info | Fee structure PDF info |
| GET | /settings/fee-structure/download | Download fee PDF |
| GET | /settings/favicon/info | Favicon info |

### 5.3 Admin / Protected Endpoints (JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /admin/login | Login; returns token |
| GET | /admin/stats | Dashboard stats |
| GET/POST | /admin/notices | List / Create notice |
| PUT/DELETE | /admin/notices/:id | Update / Delete notice |
| GET/POST | /admin/results | List / Create result |
| DELETE | /admin/results/:id | Delete result |
| GET/POST | /admin/gallery | List / Upload image |
| DELETE | /admin/gallery/:id | Delete image |
| GET | /admin/admissions | List admissions (pagination, filters) |
| POST | /admin/admissions/manual | Create manual admission |
| PUT | /admin/admissions/:id | Update admission |
| PUT | /admin/admissions/:id/status | Update status |
| GET | /admin/admissions/documents/:filename | Download document |
| CRUD | /menus, /menus/seed | Menus (admin) |
| CRUD | /categories | Categories |
| GET/POST/PUT/DELETE | /hero, /hero/all | Hero |
| CRUD | /flash-news, /flash-news/all | Flash news |
| GET/PUT | /profile | Get/Update profile |
| PUT | /profile/password | Change password |
| CRUD | /fees, /fees/:id/pay | Fees |
| GET/PUT | /site/header | Header settings |
| GET/PUT | /site/footer | Footer settings |
| CRUD | /site/footer/links | Footer links |
| GET/POST | /settings/fee-structure/upload | Upload fee PDF |
| GET/POST | /settings/favicon/upload | Upload favicon |
| GET/POST/PUT/DELETE | /trades (admin: /trades/admin/all) | Trades |
| GET/PUT | /about | About page |
| GET/PUT | /admission-process | Admission process |
| CRUD | /faculty, /faculty/admin/all | Faculty |
| CRUD | /staff | Staff |
| CRUD | /students | Students, /students/high-dues |
| CRUD | /sessions | Sessions |

(Exact method and path may vary slightly; above aligns with api.js and server routes.)

---

## 6. Database (SQLite) – Main Entities

| Table | Purpose |
|-------|---------|
| users | Admin login (email, password hash, role, permissions) |
| students | Student records (from admission or manual) |
| notices | Notices (title, description, pdf) |
| results | Results (title, trade, year, pdf) |
| gallery | Gallery (image, category) |
| sessions | Academic sessions (session_name, start_year, end_year) |
| admissions | Applications (personal, address, trade, documents JSON, status) |
| contact | Contact form submissions |
| site_settings | Key-value (header_text, principal_*, credit_card_*, etc.) |
| menus | Nav menu items (title, url, order_index, is_active) |
| categories | Categories (e.g. gallery/content) |
| hero_section | Hero slides (title, subtitle, description, image, CTAs) |
| student_fees | Fee records (student, trade, amount, status, installments) |
| fee_installments | Installment rows per fee |
| flash_news | Flash news (title, content, link, order) |
| header_settings | Header (phone, email, logo_text, tagline, links) |
| footer_settings | Footer (about_text, social, address, copyright) |
| footer_links | Footer links (title, url, category, order) |
| trades | Trades (name, slug, description, image, syllabus/careers JSON) |
| about_page | About CMS (hero, about, mission, vision, principal, stats/values/features JSON) |
| admission_process | Admission process CMS (eligibility, steps, dates, documents JSON) |
| faculty | Faculty (name, designation, department, image, bio, is_principal) |
| staff | Staff (if used for backend permissions/roles) |

Schema detail: `server/database/schema.sql`.

---

## 7. Security & Auth

- **Passwords:** bcrypt hashed (backend).
- **Admin auth:** JWT (e.g. 24h); stored in frontend (e.g. localStorage); sent as Bearer.
- **Protected routes:** Backend middleware verifies JWT on admin endpoints.
- **File uploads:** Allowed types/sizes as per server (e.g. PDF, images); stored under `server/uploads/`.
- **CORS:** Configured for frontend origin(s).
- **UIDAI:** Optional duplicate check on admission submit.

---

## 8. Non-Functional Requirements

- **Responsive:** Mobile, tablet, desktop (Tailwind).
- **Browser:** Modern browsers (Chrome, Firefox, Safari, Edge).
- **Performance:** Lazy loading where applicable; images via uploads URL.
- **Accessibility:** Semantic HTML, labels, focus; can be extended (e.g. ARIA).
- **SEO:** Meta title/description (SEOHead); static meta in index.html.
- **Error handling:** Toasts for success/error; 404 page; API errors handled in UI.
- **Deployment:** Frontend build (Vite); backend Node; SQLite file + uploads directory; env for API URL and secrets.

---

## 9. File / Folder Reference (High Level)

- **Frontend:** `client/` – `src/App.jsx`, `src/pages/`, `src/admin/`, `src/components/`, `src/services/api.js`.
- **Backend:** `server/` – `index.js`, `routes/*.js`, `controllers/*.js`, `database/db.js`, `uploads/`.
- **Database:** `server/database/database.sqlite`; schema in `server/database/schema.sql`.
- **PHP version (optional):** `php/` – same features, MDBootstrap; uses same SQLite.
- **Docs:** `phpprd.md` (this PRD), `README.md`, `ADMIN_GUIDE.md`, etc.

---

## 10. Summary Checklist

**User side:** Home, About, Trades, Trade Detail, Admission Process, Apply Admission, Fee Structure, Faculty, Infrastructure/Gallery, Notices, Results, Contact; dynamic nav/footer; contact & admission forms; SEO.

**Admin side:** Login; Dashboard; Notices, Results, Gallery; Admissions (list, status, edit, manual, documents); Staff, Students, Sessions; Settings (site, fee PDF, favicon); Menus, Categories; Flash News, Hero; Profile, Fees; Header/Footer, Trades, About, Admission Process, Faculty.

**Backend:** REST API; SQLite; JWT auth; file uploads; CORS; all CRUD and listing endpoints as per api.js and server routes.

**Layout:** Single public layout (top bar, header, main, footer); admin layout (sidebar/nav + content); responsive; primary #195de6.

This PRD covers the full website layout, frontend, backend, and all user-side and admin-side features as implemented.
