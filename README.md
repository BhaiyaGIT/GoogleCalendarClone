# 📅 Google Calendar Clone

A full-stack calendar app that works a lot like Google Calendar. Built with React on the frontend, Node.js + Express on the backend, and MongoDB for data storage.

## ✨ What It Does

### Calendar Features
- Monthly calendar view (week and day views are set up, just need to finish them)
- Create, edit, and delete events
- Repeating events (daily, weekly, monthly, yearly)
- The app warns you if you try to create an overlapping event
- Search through all your events

### User Experience
- Smooth animations that don't feel janky
- Nice modal popup for creating/editing events
- Works on phones, tablets, and computers
- Color-coded events (11 different colors)
- Real-time updates - changes show up immediately

### Event Details
- All-day events
- Event reminders
- Add attendees with their status
- Add location info
- Event descriptions
- Privacy settings (public, private, confidential)

## 📁 Project Layout

```
google_calender_clone/
├── backend/                    # Node.js + Express server
│   ├── src/
│   │   ├── controllers/
│   │   │   └── eventController.js
│   │   ├── models/
│   │   │   └── Event.js
│   │   ├── routes/
│   │   │   └── events.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   └── eventUtils.js
│   │   └── index.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── frontend/                   # React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── CalendarMonth.jsx
│   │   │   ├── CalendarMonth.css
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventCard.css
│   │   │   ├── EventModal.jsx
│   │   │   └── EventModal.css
│   │   ├── utils/
│   │   │   ├── api.js           # Talks to backend
│   │   │   ├── dateUtils.js     # Date helper functions
│   │   │   └── store.js         # State management
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── .env
│   └── README.md
└── README.md (this file)
```

## 🚀 Setup

### Prerequisites
- Node.js 16 or higher
- MongoDB (local or MongoDB Atlas)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Update MONGODB_URI if needed
npm run dev
```

Server runs at `http://localhost:5000`

### Frontend (new terminal)

```bash
cd frontend
npm install
npm start
```

App opens at `http://localhost:3000`

## � API Endpoints

Check [backend/README.md](./backend/README.md) for full API documentation.

Quick reference:
- `GET /api/events?startDate=...&endDate=...` - Get events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/search?query=...` - Search

## 🏗️ Architecture Overview

### Frontend Architecture

**Technology Stack:**
- React 18 - UI library
- Zustand - State management
- Framer Motion - Animations
- date-fns - Date utilities
- Axios - HTTP client
- CSS3 - Styling

**Key Patterns:**
- Component-based architecture
- Custom hooks for reusable logic
- Zustand stores for global state
- Optimistic updates for better UX

### Backend Architecture

**Technology Stack:**
- Express.js - Web framework
- MongoDB - NoSQL database
- Mongoose - ODM
- date-fns - Date utilities

## 🏗️ How It Works

### Frontend
- React components for UI
- Zustand for state management
- Axios to talk to backend
- date-fns for date calculations
- Framer Motion for animations

### Backend
- Express.js server
- MongoDB for data storage
- Mongoose to manage data
- Validation on every request
- Automatic conflict checking

### Key Features I Built

**Recurring Events** - Store once, show many times
- When you create "every Monday", it's stored once
- When the calendar asks for events, it generates instances on-the-fly
- Each instance can be edited individually

**Conflict Detection** - No double-booking
- Before saving an event, checks if it overlaps with others
- Returns info about conflicting events
- Prevents scheduling mistakes

**Search** - Find events fast
- Text search through titles and descriptions
- Indexed for quick results even with tons of events

**Color Coding** - 11 colors to choose from
- All Google Calendar colors available
- Makes events easy to categorize visually

## 🎨 Design

- Clean, minimal interface
- Smooth animations (60 FPS)
- Works great on phones and computers
- Matches Google Calendar look & feel
- Color-coded events for quick scanning

## 🔒 Security

- All inputs validated before saving
- Errors don't reveal sensitive info
- Event privacy settings respected
- CORS configured properly

## 🧪 Manual Testing

Try these out:
1. Create an event - should appear on calendar
2. Edit an event time
3. Delete an event
4. Create a recurring event (weekly, monthly, etc)
5. Try to create overlapping events (should fail)
6. Search for an event
7. Try it on your phone

## 🎯 What's Next

Ideas for improvements:
- Week view (the structure is there, just need the component)
- Day view (same deal)
- Drag and drop to reschedule events
- Keyboard shortcuts (Escape to close modal, etc.)
- Undo/Redo for changes
- Dark mode (CSS variables are ready)
- User login so everyone has their own calendar
- Multiple calendars for different purposes
- Share calendars with other people
- Export to iCal format
- Reminders that actually send notifications

## 📖 Full Documentation

- [Frontend Details](./frontend/README.md) - React components, state management
- [Backend Details](./backend/README.md) - API documentation, data models
- [Copilot Instructions](./.github/copilot-instructions.md) - Project setup

## 🐛 Troubleshooting

**MongoDB won't connect:**
- Make sure MongoDB is running (`mongod`)
- Check MONGODB_URI in backend/.env

**Can't access the app:**
- Is backend running on 5000? Check terminal
- Is frontend running on 3000? Check terminal
- Is MongoDB running?

**Events not saving:**
- Check browser console for errors (F12)
- Check terminal output for backend errors
- Make sure MongoDB is running

**Port already in use:**
- Change PORT in backend/.env to like 5001
- Or kill the process using that port

## 📚 Libraries I Used

- **React 18** - UI framework
- **Zustand** - State management (lighter than Redux)
- **Framer Motion** - Animations
- **Axios** - HTTP requests
- **date-fns** - Date utilities
- **Express** - Web server
- **MongoDB** - Database
- **Mongoose** - MongoDB helper

---

**Version**: 1.0.0
**Created**: November 2024
