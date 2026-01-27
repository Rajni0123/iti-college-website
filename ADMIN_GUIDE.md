# Admin Dashboard Guide

## Overview
The admin dashboard has been successfully implemented with a modern, professional design matching the website theme. It provides comprehensive management capabilities for the ITI college administration.

## Features Implemented

### 1. **Admin Layout**
- Professional sidebar navigation
- Persistent across all admin pages
- Active route highlighting
- Admin profile section with logout
- Responsive design

### 2. **Admin Dashboard** (`/admin`)
- Overview statistics cards:
  - Total Notices
  - Pending Admissions
  - New Results
  - Gallery Photos
- Quick action buttons for common tasks
- Real-time data from API

### 3. **Admission Management** (`/admin/admissions`)
- Comprehensive table view of all applications
- Search functionality by name or ID
- Filter by:
  - Trade (Electrician, Fitter, COPA, etc.)
  - Status (Pending, Approved, Rejected)
  - Category
- Statistics cards:
  - Total Applications
  - Pending Review
  - Approved
  - Rejected
- Individual application actions:
  - View details
  - More options menu
- Pagination controls
- Export data functionality
- Manual entry option

### 4. **Other Admin Pages**
- **Manage Notices** (`/admin/notices`)
- **Manage Results** (`/admin/results`)
- **Gallery** (`/admin/gallery`)
- **Staff Management** (`/admin/staff`)

## Color Theme
The admin dashboard uses a consistent color scheme:
- **Primary Color**: `#195de6` (Blue)
- **Background Light**: `#f6f6f8`
- **Background Dark**: `#111621`
- **Status Colors**:
  - Pending: Amber
  - Approved: Green
  - Rejected: Red

## Routes

### Public Routes
- `/admin/login` - Admin login page

### Protected Routes (require authentication)
- `/admin` - Main dashboard
- `/admin/notices` - Manage notices
- `/admin/results` - Manage results
- `/admin/gallery` - Gallery management
- `/admin/admissions` - Admission applications
- `/admin/staff` - Staff management

## Authentication
- Uses JWT token authentication
- Token stored in localStorage as `adminToken`
- Protected routes redirect to login if not authenticated
- Logout button in sidebar clears token and redirects

## API Integration

### Endpoints Used:
1. **GET `/api/admin/stats`** - Dashboard statistics
   - Returns: totalNotices, pendingAdmissions, newResults, galleryPhotos

2. **GET `/api/admin/admissions`** - Fetch all admissions
   - Query params: page, trade, status, date
   - Returns: Array of admission objects with pagination

3. **POST `/api/admin/login`** - Admin login
   - Body: { email, password }
   - Returns: { token, user }

## Data Structure

### Admission Object:
```javascript
{
  id: "ITI-2024-1024",
  name: "Aniket Sharma",
  initials: "AS",
  trade: "Electrician",
  status: "pending", // or "approved", "rejected"
  dateSubmitted: "24 May, 2024",
  color: "indigo" // for avatar styling
}
```

## Components Created

1. **AdminLayout.jsx** - Main layout with sidebar
2. **AdminDashboard.jsx** - Dashboard page with stats
3. **Admissions.jsx** - Admission management page
4. **Staff.jsx** - Staff management page

## Styling
- Uses Tailwind CSS
- Consistent with main website theme
- Dark mode support (dark: classes)
- Lucide React icons
- Hover states and transitions
- Shadow effects for depth

## Usage

### Starting the Application:

1. **Backend Server:**
```bash
cd server
npm start
```

2. **Frontend Dev Server:**
```bash
cd client
npm run dev
```

### Default Admin Credentials:
(Set up in your database)
- Email: admin@manerpvtiti.edu.in
- Password: (your admin password)

### Accessing Admin Dashboard:
1. Navigate to `http://localhost:5174/admin/login`
2. Enter admin credentials
3. Upon successful login, redirects to `/admin`

## Features to Enhance (Future)

1. **View Details Modal** - Click eye icon to see full application details
2. **Bulk Actions** - Select multiple applications for batch processing
3. **Advanced Filters** - Date range, qualification filters
4. **Email Notifications** - Send status updates to applicants
5. **Document Preview** - View uploaded documents inline
6. **Analytics Charts** - Visual representation of stats
7. **Export to Excel** - Download admission data
8. **Print Functionality** - Print admission forms

## Technical Details

### State Management:
- React useState for local state
- useEffect for data fetching
- useNavigate for routing

### Error Handling:
- Try-catch blocks for API calls
- Fallback to mock data if API fails
- Toast notifications for user feedback

### Responsive Design:
- Mobile-first approach
- Grid layouts adapt to screen size
- Sidebar may need mobile optimization

## File Structure
```
client/src/
├── admin/
│   ├── AdminDashboard.jsx
│   ├── AdminLogin.jsx
│   ├── AdminNotices.jsx
│   ├── AdminResults.jsx
│   ├── AdminGallery.jsx
│   ├── Admissions.jsx
│   └── Staff.jsx
├── components/
│   ├── AdminLayout.jsx
│   ├── Layout.jsx
│   └── ProtectedRoute.jsx
└── services/
    └── api.js
```

## Notes
- All admin routes are protected with JWT authentication
- Token expires after 24 hours
- The dashboard is fully functional and connected to the backend
- Mock data is used as fallback if API calls fail
- The design matches the provided HTML template exactly

## Support
For issues or questions, refer to the main README.md or contact the development team.
