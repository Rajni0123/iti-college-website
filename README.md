# ITI College Website

A modern, production-ready website for ITI College built with React and Node.js.

## Features

- 🎓 **Public Pages**: Home, About, Trades, Admission Process, Fee Structure, Faculty, Infrastructure, Notices, Results, Contact
- 📝 **Online Admission**: Complete online admission form with document upload
- 🔐 **Admin Panel**: Secure admin dashboard for content management
- 📢 **Notice Management**: Add, edit, delete notices with PDF attachments
- 📄 **Results Management**: Upload and manage examination results
- 🖼️ **Gallery Management**: Upload and manage gallery images
- 🧾 **Admission Management**: View, filter, and manage admission applications

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Icons & Lucide React
- React Hot Toast

### Backend
- Node.js
- Express.js
- SQLite
- JWT Authentication
- Multer (File Uploads)
- Bcryptjs (Password Hashing)

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

### Backend Setup

```bash
cd server
npm install
npm start
```

Backend will run on `http://localhost:5000`

## Default Admin Credentials

- **Email**: admin@iticollege.edu
- **Password**: admin123

⚠️ **Important**: Change the default password after first login!

## Project Structure

```
iti/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Public pages
│   │   ├── admin/          # Admin pages
│   │   ├── services/      # API services
│   │   └── App.jsx
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── controllers/       # Route controllers
│   ├── routes/            # API routes
│   ├── middleware/        # Auth & upload middleware
│   ├── database/          # Database setup
│   ├── uploads/           # Uploaded files
│   └── index.js
│
└── README.md
```

## API Endpoints

### Public Endpoints
- `GET /api/notices` - Get all notices
- `GET /api/results` - Get all results
- `GET /api/gallery` - Get gallery images
- `POST /api/admissions` - Submit admission application
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Protected)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Dashboard statistics
- `POST /api/admin/notices` - Create notice
- `PUT /api/admin/notices/:id` - Update notice
- `DELETE /api/admin/notices/:id` - Delete notice
- `POST /api/admin/results` - Upload result
- `POST /api/admin/gallery` - Upload gallery image
- `GET /api/admin/admissions` - Get admissions (with filters)
- `PUT /api/admin/admissions/:id/status` - Update admission status

## Environment Variables

### Backend (server/.env)
```env
PORT=5000
JWT_SECRET=your-secret-key
NODE_ENV=production
```

**⚠️ Important**: Change `JWT_SECRET` to a strong random string in production!

### Frontend (client/.env)
```env
VITE_API_URL=http://localhost:5000/api
```

**For Production**: Update to your domain: `https://yourdomain.com/api`

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed configuration.

## Deployment

### Quick Start
We provide two deployment methods:

1. **[Manual Upload Guide](./DEPLOYMENT_GUIDE.md)** - Upload files via cPanel File Manager
2. **[Git Deployment Guide](./GIT_DEPLOYMENT_GUIDE.md)** - Deploy using Git (Recommended for easier updates)

### Quick Deployment Steps

**Option 1: Using Git (Easier for Updates)**
1. Set up Git repository in cPanel
2. Clone your repository
3. Run build and deploy scripts
4. See [Git Deployment Guide](./GIT_DEPLOYMENT_GUIDE.md) for details

**Option 2: Manual Upload**
1. **Build Frontend**: `cd client && npm run build`
2. **Upload Frontend**: Upload `client/dist/` contents to `public_html/`
3. **Upload Backend**: Upload `server/` contents to `api/` folder
4. **Configure Environment**: Set up `.env` files (see deployment guide)
5. **Install Dependencies**: Run `npm install` in `api/` folder
6. **Start Server**: Use cPanel Node.js Selector or PM2

For complete step-by-step instructions with troubleshooting, refer to:
- [Manual Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Git Deployment Guide](./GIT_DEPLOYMENT_GUIDE.md)

## Database

The application uses SQLite database which is automatically created on first run. The database file is located at `server/database/database.sqlite`.

## File Uploads

Uploaded files (PDFs, images) are stored in `server/uploads/` directory. Make sure this directory has write permissions.

## Security Notes

- Change default admin password
- Use strong JWT_SECRET in production
- Enable HTTPS in production
- Regularly backup the SQLite database
- Implement rate limiting for API endpoints

## License

This project is created for ITI College.

## Support

For issues or questions, please contact the development team.
