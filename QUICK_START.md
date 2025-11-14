# 🚀 Quick Start Guide - Google Calendar Clone

Get the Google Calendar clone up and running in minutes!

## Prerequisites

- **Node.js 16+** - Download from [nodejs.org](https://nodejs.org)
- **MongoDB** - Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
- **Git** - For version control
- **Code Editor** - VS Code, WebStorm, etc.

## 🎯 5-Minute Setup

### Option 1: Automated Setup (Recommended)

**On Windows (PowerShell or CMD):**
```powershell
.\setup.bat
```

**On macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

The script will:
- ✅ Check Node.js installation
- ✅ Check MongoDB availability
- ✅ Install backend dependencies
- ✅ Install frontend dependencies
- ✅ Create configuration files

### Option 2: Manual Setup

#### Step 1: Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/google-calendar-clone
NODE_ENV=development
```

#### Step 2: Setup Frontend

```bash
cd frontend
npm install
```

Verify `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### Step 3: Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas Cloud:**
- Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Update `MONGODB_URI` in `backend/.env`

## 🏃 Running the Application

### Terminal 1 - Start Backend

```bash
cd backend
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB connected: localhost
```

### Terminal 2 - Start Frontend

```bash
cd frontend
npm start
```

Expected output:
```
Compiled successfully!
On Your Network: http://localhost:3000
```

Open browser to: **http://localhost:3000**

## ✅ Verify Installation

1. **Check Backend Health:**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Expected response:
   ```json
   {"success":true,"message":"Server is running"}
   ```

2. **Check Frontend:**
   - Open http://localhost:3000
   - Should see Google Calendar interface
   - No red errors in console

## 🧪 First Test

1. **Create Event:**
   - Click "Create" button
   - Fill in event details
   - Click "Save Event"

2. **View Event:**
   - Event appears in calendar
   - Can click to edit

3. **Delete Event:**
   - Click event card
   - Click "Delete" button

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # macOS/Linux

# Kill the process or change PORT in .env
```

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
- Ensure MongoDB is running: `mongod`
- Or use MongoDB Atlas with connection string

### CORS Error
```
Access to XMLHttpRequest blocked by CORS
```

**Solution:**
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`

### Module Not Found Error
```
npm ERR! code ENOENT
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📚 Project Documentation

- **[Main README](./README.md)** - Complete project overview
- **[Backend README](./backend/README.md)** - API documentation
- **[Frontend README](./frontend/README.md)** - Component guide

## 🎨 Key Features to Try

### 1. Create Recurring Event
- Create event → Set repeat to "Weekly"
- Creates automatic instances for all future weeks

### 2. Conflict Detection
- Try creating overlapping events
- System prevents conflicts and shows warning

### 3. Color-Coded Events
- Create multiple events with different colors
- Easy visual organization

### 4. Navigate Calendar
- Use arrow buttons to go prev/next month
- "Today" button jumps to current date

### 5. Event Details
- Edit event title, description, location
- Add attendees and reminders
- Set visibility (public/private)

## 🔧 Development

### Available Commands

**Backend:**
```bash
npm run dev    # Development with auto-reload
npm start      # Production
npm test       # Run tests
```

**Frontend:**
```bash
npm start      # Development server
npm build      # Production build
npm test       # Run tests
```

### File Locations

- **Backend API:** http://localhost:5000/api
- **Frontend Dev:** http://localhost:3000
- **MongoDB:** localhost:27017
- **Database:** google-calendar-clone

## 📱 Testing on Mobile

### Option 1: Local Network
```bash
# Find your machine IP
ipconfig getifaddr en0    # macOS
ipconfig                  # Windows

# Access from mobile: http://<YOUR_IP>:3000
```

### Option 2: Chrome DevTools
- Press F12 → Device toolbar (Ctrl+Shift+M)
- Test responsive design

## 🚀 Next Steps

1. **Explore the Code:**
   - Backend: `backend/src/` 
   - Frontend: `frontend/src/`

2. **Enhance Features:**
   - Add week view: `frontend/src/components/CalendarWeek.jsx`
   - Add day view: `frontend/src/components/CalendarDay.jsx`
   - Implement drag-drop scheduling

3. **Deploy:**
   - Backend: Heroku, Railway, AWS
   - Frontend: Vercel, Netlify, AWS S3

## 💡 Tips & Tricks

- Use browser DevTools for debugging
- Check browser console for API errors
- MongoDB Atlas free tier is perfect for testing
- Use Postman to test API endpoints
- Enable Redux/Zustand DevTools for state debugging

## 🆘 Need Help?

1. Check relevant README files
2. Review error messages carefully
3. Check browser console (F12 → Console)
4. Verify all services are running
5. Try restarting servers

## 📝 Common Commands

```bash
# Backend operations
cd backend
npm install              # Install dependencies
npm run dev              # Start dev server
npm test                 # Run tests
npm start                # Production

# Frontend operations
cd frontend
npm install              # Install dependencies
npm start                # Start dev server
npm build                # Build for production
npm test                 # Run tests

# Database
mongod                   # Start MongoDB locally

# Utilities
git status               # Check git status
git add .                # Stage changes
git commit -m "message"  # Commit changes
```

## ✨ Success Checklist

- [ ] Node.js installed
- [ ] MongoDB running
- [ ] Backend installed & running on port 5000
- [ ] Frontend installed & running on port 3000
- [ ] Can create events
- [ ] Can edit events
- [ ] Can delete events
- [ ] Can navigate calendar months
- [ ] No errors in browser console

---

**Ready?** Open http://localhost:3000 and start building! 🎉

For detailed information, see the main [README.md](./README.md)
