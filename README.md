# Student Companion

A comprehensive web-based productivity app designed for students to manage their academic life in one place.

## Features

### 📋 Dashboard
Your home screen at a glance showing:
- Pending tasks count
- Active courses
- Cumulative GPA
- Smart reminders based on your workload

### ✅ Tasks
Organize assignments and to-dos with:
- Task name and due dates
- Priority levels (Low, Medium, High) with color coding
- Mark tasks as done (they remain visible with strikethrough)
- Visual priority indicators

### 📅 Weekly Timetable
Build and manage your schedule:
- Add classes by selecting day, course name, start time, duration, and venue
- View all classes in a weekly grid layout
- Toggle Saturday and Sunday on/off
- Give your timetable a custom name
- Export your timetable as a PDF

### 📊 Grade Tracker
Track your academic performance:
- Add courses with scores (0–100) and credit hours
- Automatic letter grade conversion using UG grading scale
- Color-coded grades (Green: Good 80+, Yellow: Okay 50-79, Red: Bad <50)
- Weighted GPA calculation
- GPA with color indicators on both Dashboard and Grades section

**UG Grading Scale:**
- A (80–100, 4.0) · B+ (75–79, 3.5) · B (70–74, 3.0)
- C+ (65–69, 2.5) · C (60–64, 2.0) · D+ (55–59, 1.5)
- D (50–54, 1.0) · F (0–49, 0.0)

### 📝 Quick Notes
Save and organize study notes:
- Create titled note cards
- Add content directly
- Remove notes with the × button
- All notes displayed in a grid

### 📂 Subject Slides
Upload and organize course materials:
- Drag & drop or click to upload files
- Support for PDF, PPTX, DOCX, images, and any file type
- Tag files with course names for easy filtering
- Files stored in browser local storage
- Open or download files anytime

### 🎨 Themes
- Light mode (soft grey and beige aesthetic)
- Dark mode (warm dark grey and brown)
- Toggle theme with the moon/sun icon

## Getting Started

1. **Open the app**: Load `index.html` in your web browser
2. **Enter your name**: The app will greet you with a personalized welcome
3. **Start organizing**: Navigate between sections using the top menu
4. **Data saved automatically**: All information is stored in your browser's local storage

## Navigation

Use the navigation bar at the top to switch between sections:
- Dashboard
- Tasks
- Timetable
- Grades
- Notes
- Slides
- Help

## Data & Privacy

✅ **All data is stored locally in your browser**
- Nothing is sent to external servers
- Your information stays on your device
- Your data persists until you clear browser site data

⚠️ **Important**: Back up your timetable by exporting it as PDF before clearing browser data

## Browser Compatibility

Works on all modern browsers (Chrome, Firefox, Safari, Edge) with:
- JavaScript enabled
- Local storage support
- Modern CSS features

## Mobile Friendly

The app is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

All input fields have consistent widths for better mobile UX.

## Color Scheme

**Light Mode:**
- Primary accent: Beige
- Navigation: Soft grey
- Background: Warm soft grey

**Dark Mode:**
- Background: Warm dark grey-brown
- Surfaces: Rich warm brown
- Navigation: Soft grey

## Tips for Best Experience

1. **Organize by course**: Name your notes and slides by course code for easy filtering
2. **Use priorities wisely**: Assign task priorities to stay focused
3. **Update timetable weekly**: Keep your schedule current
4. **Export timetable**: Save a PDF copy as a backup
5. **Review grades**: Check your GPA regularly to monitor academic progress

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Storage**: Browser Local Storage
- **PDF Export**: jsPDF with AutoTable plugin
- **Fonts**: DM Sans, Playfair Display

## Files

- `index.html` - Main application structure
- `style.css` - Styling and layout
- `app.js` - Application logic

## Support

For help using the app, visit the Help section (?) in the navigation menu for detailed guides on each feature.

---

**Version**: 1.0  
**Last Updated**: June 2, 2026  
Made with ❤️ for students
