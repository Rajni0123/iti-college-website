# Site Settings Management Guide

## Overview
The admin panel now includes a comprehensive Site Settings page that allows you to control dynamic content on the homepage without editing code.

## Features Added

### 1. **Flash News Header** (Top Marquee)
- **Location**: Top of homepage (scrolling text)
- **Editable in Admin**: Yes
- **Default**: "Important: Last date for trade change application is 15th Oct. | New Semester Exam Schedule (Dec 2024) is now available..."

### 2. **Principal's Message**
- **Location**: Right sidebar on homepage
- **Editable Fields**:
  - Principal Name
  - Principal's Image URL
  - Message Text
- **Default**:
  - Name: Dr. Rajesh Kumar
  - Message: "Welcome to Maner Pvt ITI, a premier institution committed to providing quality vocational training..."

### 3. **Student Credit Card Facility**
- **Location**: Below Quick Links on homepage
- **Editable Fields**:
  - Enable/Disable toggle
  - Title
  - Description
- **Features**:
  - Beautiful gradient card design (emerald/teal)
  - Two action buttons (Apply Now, Learn More)
  - Can be hidden completely via toggle
- **Default**:
  - Title: "Student Credit Card Facility Available"
  - Description: "Get financial support through Bihar Student Credit Card Scheme..."

## How to Access

### Admin Panel Route:
```
/admin/settings
```

### Navigation:
1. Login to admin panel (`/admin/login`)
2. Click "Site Settings" in the sidebar (gear icon at bottom)
3. Edit any content
4. Click "Save Settings"
5. Changes appear instantly on homepage

## Database Structure

### Table: `site_settings`
```sql
CREATE TABLE site_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Settings Keys:
- `header_text` - Flash news marquee text
- `principal_name` - Principal's name
- `principal_message` - Principal's message content
- `principal_image` - URL for principal's photo
- `credit_card_enabled` - "true" or "false"
- `credit_card_title` - Credit card section title
- `credit_card_description` - Credit card section description

## API Endpoints

### Public Endpoint:
```
GET /api/settings
```
Returns all site settings as JSON object.

**Example Response:**
```json
{
  "header_text": "Admission Open 2024-25...",
  "principal_name": "Dr. Rajesh Kumar",
  "principal_message": "Welcome to Maner Pvt ITI...",
  "principal_image": "https://example.com/image.jpg",
  "credit_card_enabled": "true",
  "credit_card_title": "Student Credit Card Facility Available",
  "credit_card_description": "Get financial support..."
}
```

### Admin Endpoints (Protected):
```
GET /api/admin/settings
PUT /api/admin/settings
PUT /api/admin/settings/:key
```

## File Structure

### Backend:
```
server/
├── controllers/
│   └── settings.controller.js    # Settings CRUD logic
├── routes/
│   └── settings.routes.js        # Settings API routes
└── database/
    └── db.js                      # Added settings table
```

### Frontend:
```
client/src/
├── admin/
│   └── AdminSettings.jsx          # Admin settings page
├── pages/
│   └── Home.jsx                   # Updated to use dynamic settings
└── components/
    └── AdminLayout.jsx            # Added settings link
```

## Usage Examples

### Example 1: Update Flash News
1. Go to `/admin/settings`
2. Edit "Header Text (Marquee)"
3. Enter: "🎓 New Batch Starting February 2025! Limited Seats Available. | Results Declared for December 2024 Exams."
4. Click "Save Settings"
5. Refresh homepage - new text appears in marquee

### Example 2: Change Principal's Message
1. Go to `/admin/settings`
2. Update Principal Name to "Dr. Anjali Sharma"
3. Update Message to your custom message
4. Upload new image URL
5. Click "Save Settings"
6. Homepage instantly shows new principal info

### Example 3: Disable Credit Card Section
1. Go to `/admin/settings`
2. Uncheck "Display Student Credit Card Section"
3. Click "Save Settings"
4. Credit card section disappears from homepage

### Example 4: Update Credit Card Info
1. Go to `/admin/settings`
2. Ensure checkbox is enabled
3. Update Title: "अब शिक्षा ऋण उपलब्ध है"
4. Update Description: "बिहार स्टूडेंट क्रेडिट कार्ड के माध्यम से ₹4 लाख तक का ब्याज मुक्त ऋण प्राप्त करें।"
5. Click "Save Settings"
6. Homepage shows updated Hindi content

## Design Features

### AdminSettings Component:
- ✅ Clean, organized sections
- ✅ Real-time image preview
- ✅ Toggle switch for credit card section
- ✅ Textarea for long content
- ✅ Save button with loading state
- ✅ Toast notifications
- ✅ Professional styling

### Homepage Integration:
- ✅ Dynamic marquee text
- ✅ Dynamic principal's message
- ✅ Dynamic principal's image
- ✅ Conditional student credit card section
- ✅ Beautiful gradient card design
- ✅ Responsive layout

## Default Values

All settings have sensible defaults that are automatically inserted when the database is initialized:

```javascript
const defaultSettings = [
  ['header_text', 'Admission Open for Academic Session 2024-25...'],
  ['principal_name', 'Dr. Rajesh Kumar'],
  ['principal_message', 'Welcome to Maner Pvt ITI...'],
  ['principal_image', 'https://...'],
  ['credit_card_enabled', 'true'],
  ['credit_card_title', 'Student Credit Card Facility Available'],
  ['credit_card_description', 'Get financial support...']
];
```

## Benefits

### For Admins:
- 🎯 **No coding required** - Update content through UI
- ⚡ **Instant updates** - Changes appear immediately
- 🔒 **Secure** - Only authenticated admins can edit
- 📱 **Easy to use** - Simple form interface

### For Users:
- 🔄 **Always current** - See latest information
- 🎨 **Consistent design** - Professional appearance
- 📱 **Responsive** - Works on all devices
- 🌐 **Multilingual** - Can add content in any language

## Technical Details

### Data Flow:
```
Admin Panel → Update Settings → Database → API → Homepage
```

1. Admin edits settings in `/admin/settings`
2. Settings saved to `site_settings` table
3. Homepage fetches settings from `/api/settings`
4. Content rendered dynamically

### State Management:
- Uses React `useState` and `useEffect`
- Fetches settings on component mount
- Merges with default values as fallback
- Real-time updates without page reload

### Error Handling:
- API failures use default values
- Toast notifications for success/errors
- Loading states during operations
- Form validation

## Future Enhancements

Potential additions:
- 📸 Image upload (instead of URLs)
- 🎨 Theme customization
- 📝 Rich text editor for messages
- 🌐 Multi-language support
- 📊 Analytics integration
- 🔔 Notification scheduling
- 📱 Mobile app settings

## Testing

### Manual Testing Steps:
1. ✅ Login to admin panel
2. ✅ Navigate to Site Settings
3. ✅ Edit each field
4. ✅ Save settings
5. ✅ Verify homepage updates
6. ✅ Test credit card toggle
7. ✅ Test with empty fields
8. ✅ Test with long content

### Edge Cases:
- Empty principal name → Uses default
- Invalid image URL → Shows placeholder
- Very long marquee text → Scrolls properly
- Disabled credit card → Section hidden

## Support

For issues or questions:
1. Check browser console for errors
2. Verify admin authentication
3. Check API endpoint responses
4. Review database connection
5. Check file permissions

## Conclusion

The Site Settings feature provides a powerful, user-friendly way to manage homepage content without touching code. It's secure, fast, and designed for non-technical users.

**All homepage content is now dynamic and editable through the admin panel!** 🎉
