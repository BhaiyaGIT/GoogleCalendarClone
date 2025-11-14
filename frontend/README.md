# Frontend - Google Calendar Clone

A React 18 + Zustand + Framer Motion frontend application that replicates Google Calendar with a smooth, responsive interface.

## 🚀 Getting Started

### What You Need
- Node.js 16 or higher
- npm (comes with Node.js)

### Setup

First, install the dependencies:

```bash
npm install
```

Then create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Running the App

**Development Mode** (with hot reload):
```bash
npm start
```

Open your browser at `http://localhost:3000` - the app will automatically reload when you make changes.

**Production Build:**
```bash
npm run build
```

This creates an optimized build in the `build/` folder ready for deployment.

## 📖 Components

### CalendarMonth
The main calendar view - displays all days in a month grid.

- Shows a 7-column grid (Sunday to Saturday)
- Each day cell displays up to 3 events with a "+X more" indicator
- Navigate between months using the arrow buttons
- "Today" button jumps to current date
- Click any day to create a new event
- Today's date is highlighted with a blue circle
- Fully responsive on mobile, tablet, and desktop

**Uses:** Zustand store for events, Framer Motion for animations

### EventModal
The form for creating and editing events.

**What you can set:**
- Event title (required)
- Start and end times (required - validates end > start)
- All-day toggle
- Location and description
- 11 different colors to choose from
- Recurrence options (none, daily, weekly, monthly, yearly)
- Add reminders at different intervals
- Add attendees with their status
- Visibility (public, private, confidential)

**Form Features:**
- Real-time validation with error messages
- Smooth modal animations
- Delete button for existing events
- Cancel without saving

### EventCard
The small card that displays an event on the calendar.

- Shows event title and time
- Color-coded based on event color choice
- Location icon if location is set
- Smooth hover effect
- Truncates long titles

## 🎨 Styling

I used **CSS variables** for the design system, making it easy to update colors throughout the app. The color scheme is inspired by Google Calendar.

### Main Colors
```css
--primary: #1f2937      /* Dark text color */
--accent: #3b82f6       /* Blue for primary actions */
--bg-primary: #ffffff   /* White background */
--bg-secondary: #f9fafb /* Light gray for sections */
--text-primary: #1f2937 /* Dark text */
--border: #e5e7eb       /* Light borders */
```

### Event Colors
11 different colors matching Google Calendar style:
- **tomato** - Red/Orange
- **flamingo** - Pink
- **tangerine** - Orange
- **banana** - Yellow
- **sage** - Light Green
- **basil** - Dark Green
- **peacock** - Cyan/Blue
- **blueberry** - Blue
- **lavender** - Light Purple
- **grape** - Purple
- **graphite** - Gray

### Responsive Design
- **Mobile** (< 640px) - Single column, touch-friendly
- **Tablet** (640px - 1024px) - Optimized spacing
- **Desktop** (> 1024px) - Full calendar grid

## 🔄 How State Management Works

I'm using **Zustand** for state management - it's simpler and lighter than Redux.

### What's Stored
```javascript
{
  events: [],           // All events from the API
  selectedEvent: null,  // Currently selected event
  isModalOpen: boolean, // Is the modal visible?
  currentDate: Date,    // What month are we viewing?
  view: string,         // month, week, or day
  searchQuery: string,  // Current search text
  isLoading: boolean,   // Waiting for API response?
  error: string         // Any error messages
}
```

### How to Use It
```javascript
import { useCalendarStore } from '../utils/store';

function MyComponent() {
  const { events, createEvent, fetchEvents } = useCalendarStore();
  
  // Fetch events when component loads
  useEffect(() => {
    fetchEvents(startDate, endDate);
  }, []);
  
  // Create a new event
  const handleCreate = async (data) => {
    await createEvent(data);
  };
  
  return <div>{events.length} events</div>;
}
```

### Available Actions
- `fetchEvents(startDate, endDate)` - Get events for a date range
- `createEvent(eventData)` - Add a new event
- `updateEvent(id, eventData)` - Edit an event
- `deleteEvent(id)` - Remove an event
- `searchEvents(query)` - Search all events
- `openEventModal(event)` - Open the modal with an event
- `closeModal()` - Close the modal

## 🌐 Talking to the Backend

I created an **API client** using Axios that handles all communication with the backend.

**Location:** `src/utils/api.js`

**Endpoints Used:**
```javascript
// Get events for a date range
eventAPI.getEvents(startDate, endDate)

// Get a single event
eventAPI.getEvent(id)

// Create a new event
eventAPI.createEvent(eventData)

// Update an event
eventAPI.updateEvent(id, eventData)

// Delete an event
eventAPI.deleteEvent(id)

// Search events
eventAPI.searchEvents(query)
```

**Error Handling:**
- Network errors are caught and displayed as error messages
- The Zustand store manages loading and error states
- Failed requests don't crash the app

**Configuration:**
```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});
```

## 📅 Date Utilities

I created a bunch of helper functions in `src/utils/dateUtils.js` to handle date calculations:

```javascript
// Generate calendar grid
getMonthDays(date)         // All days to display (including prev/next month)
getWeekDays(date)          // Days in a single week
getDayHours(date)          // Hours for day view (8 AM - 8 PM)

// Check dates
isToday(date)              // Is this today?
isCurrentMonth(date)       // Is this in the current month?
isEventInRange(event)      // Is event in this date range?

// Navigate
previousMonth(date)        // Jump to previous month
nextMonth(date)            // Jump to next month
getMonthYear(date)         // Get formatted "November 2024" string

// Event positioning
getEventPosition(event, dayStart)  // Calculate where to place event on grid

// Display formatting
formatTime(date)           // "2:30 PM"
formatDate(date)           // "Jan 15, 2024"
formatDateTime(date)       // "Jan 15, 2024 2:30 PM"
getShortDayName(date)      // "Mon", "Tue", etc.
```

These use the `date-fns` library, which handles all the tricky date logic so I don't have to.

## 🎬 Animations

I used **Framer Motion** to add smooth animations throughout the app.

**Page Load:**
- Calendar fades in smoothly when it loads

**Modal:**
- Scales up from small to full size
- Fades in and out nicely

**Cards:**
- Hover effect makes them slightly bigger
- Smooth transition, not jarring

These animations make the app feel polished and responsive. All animations use GPU acceleration for 60 FPS performance.

## 🔧 Project Structure

```
src/
├── components/
│   ├── CalendarMonth.jsx      # The main calendar grid
│   ├── CalendarMonth.css
│   ├── EventCard.jsx          # Individual event display
│   ├── EventCard.css
│   ├── EventModal.jsx         # Event create/edit form
│   └── EventModal.css
├── utils/
│   ├── api.js                 # Axios API client
│   ├── dateUtils.js           # Date helper functions
│   └── store.js               # Zustand state management
├── styles/
│   └── global.css             # Theme colors and global styles
├── App.jsx                    # Main app component
├── App.css
└── index.js                   # React entry point
public/
├── index.html
└── favicon.ico
```

## 🚀 Performance Notes

**Rendering:**
- React components only re-render when their data actually changes
- Zustand keeps state updates efficient
- CSS animations use GPU acceleration for smooth 60 FPS

**Network:**
- Axios handles requests efficiently
- The app shows loading states while waiting for data
- Errors are handled gracefully without crashes

**CSS:**
- CSS Grid layout is optimized for the calendar
- Critical styles are in global.css
- Component-specific styles are kept in their own files

## 🧪 Testing

To test the app manually:

1. Create an event by clicking a day
2. Fill in the form and save
3. Click an event to edit it
4. Delete an event
5. Navigate between months
6. Try it on your phone to test responsive design
7. Check the browser console (F12) for any errors

**Chrome DevTools Tips:**
- Use the React DevTools extension to inspect components
- Watch the Network tab to see API calls
- Check the Console for error messages

## 📦 Dependencies I Used

**The Big Ones:**
- **react** - UI library
- **react-dom** - Renders React to the browser

**State & Data:**
- **zustand** - Lightweight state management (simpler than Redux)
- **axios** - Makes HTTP requests to the backend

**Dates:**
- **date-fns** - All the date math so I don't have to write it

**Visual:**
- **framer-motion** - Smooth animations
- **lucide-react** - Pretty icons

## 🌐 Environment Setup

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Make sure your backend is running on port 5000, or update this URL to match.

## 🔐 Security

- Form inputs are validated before sending to the backend
- Only talking to the backend API (CORS is configured)
- Event visibility settings are respected
- No passwords or sensitive data stored locally

## 🚀 Deploying to Production

**Build the app:**
```bash
npm run build
```

This creates an optimized version in the `build/` folder that's ready to deploy.

**Where to Deploy:**
- Vercel (free, very easy)
- Netlify (free, simple)
- GitHub Pages (free, good for static)
- Your own server (more control)

**Before Deploying:**
Update the `.env` file with your production backend URL:
```env
REACT_APP_API_URL=https://your-api.com/api
```

Then run `npm run build` again.

## 📱 Mobile Experience

The app works great on phones and tablets:

- Calendar is responsive - automatically adjusts for smaller screens
- Touch-friendly buttons and form inputs
- Modal form works well on mobile
- All features are accessible on any device

**Test on Your Phone:**
1. Start the app: `npm start`
2. Find your computer's IP address (not localhost)
3. Open `http://YOUR_IP:3000` on your phone
4. Try creating and editing events

Or use Chrome DevTools to simulate a phone:
- Press Ctrl+Shift+M to open device simulator

## 🔄 Development Workflow

This is how I typically work on the app:

1. Open terminal, go to backend: `cd ../backend && npm run dev`
2. Open another terminal, go to frontend: `npm start`
3. Make changes to React components
4. Save file - app automatically reloads in browser
5. Test the changes
6. Repeat!

Hot reload makes development fast - no need to restart anything.

## 📚 Useful Resources

If you want to learn more about the libraries I used:

- [React Docs](https://react.dev) - Official React guide
- [Zustand GitHub](https://github.com/pmndrs/zustand) - State management
- [Framer Motion](https://www.framer.com/motion) - Animation docs
- [date-fns](https://date-fns.org) - Date utility docs
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid) - CSS layout

## 🎯 Future Ideas

Things I could add next:
- Week view (structured, just need the component)
- Day view (structured, just need the component)
- Drag and drop events to reschedule
- Keyboard shortcuts
- Dark mode (CSS variables already support it)
- Event categories/labels
- Repeat event series editing
- Undo/Redo functionality
- Print calendar
- Export to iCal format

## 📝 Notes

- This app focuses on the frontend experience - all the heavy lifting for recurring events and conflicts happens in the backend
- The styling is clean and minimal, focusing on usability over flashiness
- All date handling is done in UTC to avoid timezone issues
- The modal component is pretty powerful - it handles create, edit, and delete in one component

---

**Version**: 1.0.0
