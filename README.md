# Maner Pvt ITI - College Website

Official website for **Maner Pvt ITI** (Industrial Training Institute), Maner, Patna - 801108.

**Live Site:** [https://manerpvtiti.space](https://manerpvtiti.space)
**Admin Panel:** [https://manerpvtiti.space/admin/login](https://manerpvtiti.space/admin/login)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, Tailwind CSS 3, React Router 7 |
| Backend | Node.js, Express.js 4 |
| Database | SQLite 3 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| File Upload | Multer (50MB limit) |
| Hosting | A2 Hosting (cPanel + LiteSpeed + Passenger) |

---

## Features

### Public Pages (12 pages)
- Home, About, Trades, Trade Detail, Admission Process, Apply Admission
- Fee Structure, Faculty, Infrastructure (with Gallery & Lightbox), Notices, Results, Contact

### Admin Panel (20+ management pages)
- Dashboard, Notices, Results, Gallery, Admissions, Staff, Students
- Sessions, Settings, Menus, Categories, Flash News, Hero Section
- Profile, Fees, Header/Footer, Trades, About, Admission Process, Faculty

---

## Local Development Setup

### Prerequisites
- Node.js v18+ and npm

### Frontend
```bash
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```

### Backend
```bash
cd server
npm install
node index.js
# Runs on http://localhost:5000
```

### Default Admin Login
- **Email:** admin@iticollege.edu
- **Password:** admin123
- **IMPORTANT:** Change password immediately after first login!

---

## Project Structure

```
iti/
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/        # Shared components (AdminLayout, HeroSection, etc.)
│   │   ├── pages/             # Public pages (Home, About, Infrastructure, etc.)
│   │   ├── admin/             # Admin panel pages (21 files)
│   │   └── services/api.js    # Centralized API service (axios)
│   ├── public/.htaccess       # SPA routing rules
│   ├── .env                   # Dev environment (VITE_API_URL=localhost)
│   ├── .env.production        # Prod environment (VITE_API_URL=manerpvtiti.space)
│   └── vite.config.js
│
├── server/                    # Node.js Backend (Express)
│   ├── controllers/           # 21 controller files
│   ├── routes/                # 21 route files
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication middleware
│   │   └── upload.js          # Multer file upload config
│   ├── database/
│   │   ├── db.js              # SQLite init + 22 tables + seed data
│   │   └── schema.sql         # Database schema export
│   ├── public/                # Production frontend build (auto-generated)
│   ├── uploads/               # Uploaded files (images, PDFs)
│   ├── index.js               # Express server entry point
│   └── .env                   # Server environment config
│
└── README.md
```

---

## A2 Hosting (cPanel) Deployment

### Architecture on Server

```
/home/ecowells/
├── manerpvtiti.space/          # Domain root (LiteSpeed serves this)
│   ├── .htaccess               # Routes: /api -> Node.js, /uploads -> server/uploads, SPA catch-all
│   ├── index.html              # React SPA entry
│   ├── assets/                 # JS/CSS bundles
│   └── server/                 # Node.js app (Passenger)
│       ├── index.js            # Express server (serves API + frontend)
│       ├── public/             # Frontend build (fallback serving)
│       ├── uploads/            # Uploaded files
│       ├── database/           # SQLite DB
│       └── node_modules/
└── temp-pull/                  # Git clone for pulling updates
```

### How to Deploy Updates

```bash
# 1. Activate Node.js environment
source /home/ecowells/nodevenv/manerpvtiti.space/server/20/bin/activate

# 2. Pull latest code
cd ~/temp-pull && git pull origin main

# 3. Copy updated server files
cp ~/temp-pull/server/index.js /home/ecowells/manerpvtiti.space/server/index.js

# 4. Copy frontend build to both locations
cp -r ~/temp-pull/server/public/* /home/ecowells/manerpvtiti.space/server/public/
cp ~/temp-pull/server/public/index.html /home/ecowells/manerpvtiti.space/index.html
cp -r ~/temp-pull/server/public/assets/* /home/ecowells/manerpvtiti.space/assets/

# 5. Restart Node.js app (via cPanel > Setup Node.js App > Restart)
```

### How to Rebuild Frontend on Server

```bash
source /home/ecowells/nodevenv/manerpvtiti.space/server/20/bin/activate
cd ~/temp-pull/client
npm install --include=dev
./node_modules/.bin/vite build
cp -r dist/* /home/ecowells/manerpvtiti.space/server/public/
cp dist/index.html /home/ecowells/manerpvtiti.space/index.html
cp -r dist/assets/* /home/ecowells/manerpvtiti.space/assets/
```

---

## Issues Faced & Solutions

### Issue 1: Website showing 404 on root domain
**Problem:** `https://manerpvtiti.space` returned LiteSpeed 404 error.
**Cause:** Node.js app (Passenger) handled all requests but only had `/api/*` routes - no frontend serving.
**Solution:** Added `express.static('public')` and a catch-all `app.get('*')` route in `server/index.js` to serve the React build. Also copied `index.html` and `assets/` to the domain root for LiteSpeed to serve directly.

### Issue 2: Admin panel routes returning 404 (/admin/login)
**Problem:** `https://manerpvtiti.space/admin/login` returned 404.
**Cause:** `.htaccess` used `[P]` (proxy) flag which requires `mod_proxy` - not available on LiteSpeed.
**Solution:** Removed `[P,L]` flag. Changed to simple `RewriteRule ^ - [L]` for `/api/` skip, and `RewriteRule ^ index.html [L]` for SPA catch-all.

### Issue 3: Uploaded images showing broken (gallery)
**Problem:** Gallery images showed broken icon with alt text only.
**Cause:** Frontend requested `/uploads/filename.png` but files were at `/server/uploads/` on disk. LiteSpeed couldn't find them in domain root.
**Solution:** Added `.htaccess` rewrite rule: `RewriteRule ^uploads/(.*)$ /server/uploads/$1 [L]` to internally map `/uploads/` to `/server/uploads/`.

### Issue 4: `npm` and `node` commands not found on server
**Problem:** `bash: npm: command not found` when trying to build on A2 Hosting.
**Cause:** Node.js is installed via cPanel Node.js Selector with a virtual environment, not globally.
**Solution:** Activate the Node.js environment first: `source /home/ecowells/nodevenv/manerpvtiti.space/server/20/bin/activate`

### Issue 5: `vite build` failing on server
**Problem:** `npx vite build` threw `ERR_MODULE_NOT_FOUND: Cannot find package 'vite'`.
**Cause:** `npm install` only installed production deps. Vite is a devDependency.
**Solution:** Use `npm install --include=dev` to install devDependencies, then `./node_modules/.bin/vite build`. Alternatively, build locally and push `server/public/` via Git.

### Issue 6: Vite favicon showing instead of college icon
**Problem:** Browser tab showed Vite logo instead of ITI branding.
**Cause:** Default Vite scaffold `<link rel="icon" href="/vite.svg" />` was never changed.
**Solution:** Replaced with inline SVG favicon: `data:image/svg+xml,...` showing "ITI" text on blue background. Removed `vite.svg` from project.

### Issue 7: TradeManagement.jsx using localhost URLs
**Problem:** PDF download links in admin trade management pointed to `http://localhost:5000`.
**Cause:** Hardcoded fallback URL `(import.meta.env.VITE_API_URL || 'http://localhost:5000/api')` in 2 places.
**Solution:** Changed fallback to `'https://manerpvtiti.space/api'`.

### Issue 8: Admin sidebar showing "John Doe" hardcoded
**Problem:** Admin panel sidebar always showed "John Doe / Super Admin" regardless of logged-in user.
**Cause:** Name was hardcoded in `AdminLayout.jsx`.
**Solution:** Added `useEffect` to fetch profile from `/api/profile` and display actual admin name, email initial avatar, and role dynamically.

### Issue 9: Heredoc commands failing in SSH terminal
**Problem:** Copy-pasting multi-line heredoc commands (like `cat > file << 'EOF'`) got stuck in terminal.
**Cause:** Terminal line breaks were not handled properly when pasting.
**Solution:** Type the closing delimiter (e.g., `HTEOF`) manually and press Enter. Or use single-line commands instead.

### Issue 10: CORS allowing all origins
**Problem:** CORS config had `callback(null, true)` for unrecognized origins.
**Cause:** Fallback was set to allow all for "flexibility".
**Note:** Currently works but should be restricted to only `manerpvtiti.space` in production for security.

---

## Environment Variables

### Server (`server/.env`)
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=<change-to-random-64-byte-string>
API_DOMAIN=https://manerpvtiti.space
FRONTEND_URL=https://manerpvtiti.space
DATABASE_PATH=./database/database.sqlite
MAX_FILE_SIZE=50mb
```

### Frontend (`client/.env.production`)
```env
VITE_API_URL=https://manerpvtiti.space/api
VITE_SITE_URL=https://manerpvtiti.space
```

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/health/db` | Database health check |
| GET | `/api/notices` | All notices |
| GET | `/api/results` | All results |
| GET | `/api/gallery` | Gallery images |
| GET | `/api/trades` | Active trades |
| GET | `/api/trades/:slug` | Trade by slug |
| GET | `/api/about` | About page data |
| GET | `/api/faculty` | Faculty list |
| GET | `/api/admission-process` | Admission process |
| GET | `/api/fees` | Fee structure |
| GET | `/api/settings` | Site settings |
| GET | `/api/menus` | Navigation menus |
| GET | `/api/hero` | Hero section data |
| GET | `/api/flash-news` | Flash news |
| GET | `/api/categories` | Categories |
| GET | `/api/site` | Header/footer settings |
| POST | `/api/admissions` | Submit admission |
| POST | `/api/contact` | Submit contact form |

### Admin (JWT Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/stats` | Dashboard stats |
| CRUD | `/api/admin/notices` | Manage notices |
| CRUD | `/api/admin/results` | Manage results |
| CRUD | `/api/admin/gallery` | Manage gallery |
| GET | `/api/admin/admissions` | View admissions |
| CRUD | `/api/admin/settings` | Site settings |
| GET | `/api/profile` | Admin profile |
| PUT | `/api/profile` | Update profile |
| PUT | `/api/profile/password` | Change password |
| CRUD | `/api/trades` | Manage trades (admin) |
| CRUD | `/api/sessions` | Manage sessions |
| CRUD | `/api/staff` | Manage staff |
| CRUD | `/api/students` | Manage students |

---

## Security Checklist

- [ ] Change default admin password (`admin123`)
- [ ] Change `JWT_SECRET` in `server/.env` to a random string
- [ ] Restrict CORS to only your domain
- [ ] Enable HTTPS (SSL certificate)
- [ ] Set file permissions: `uploads/` = 775, `database/` = 755
- [ ] Keep `server/.env` file private (not in public access)
- [ ] Regular database backups

---

## License

Built for Maner Pvt ITI, Patna, Bihar.
