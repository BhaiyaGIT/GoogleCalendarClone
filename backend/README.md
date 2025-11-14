# Backend - Google Calendar Clone

Node.js + Express + MongoDB server for the Google Calendar clone frontend.

## 🚀 Getting Started

### Requirements
- Node.js 16 or higher
- MongoDB (either local or MongoDB Atlas cloud)

### Setup

Install dependencies:
```bash
npm install
```

Create a `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/google-calendar-clone
NODE_ENV=development
```

### Running

**Development** (auto-reload when you change code):
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server runs at `http://localhost:5000`

## 📖 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Quick Health Check
```http
GET /api/health
```

This just tells you if the server is running.

## 📅 Event Endpoints

### Get All Events (for a date range)
```http
GET /api/events?startDate=2024-01-01&endDate=2024-01-31
```

This returns all events that happen between those dates. If an event recurs (like "every Monday"), it automatically expands it into individual instances for that date range.

**Parameters:**
- `startDate` - Start date in ISO format (required)
- `endDate` - End date in ISO format (required)

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "abc123-uuid",
      "title": "Team Meeting",
      "description": "Weekly sync",
      "startTime": "2024-01-15T14:00:00Z",
      "endTime": "2024-01-15T15:00:00Z",
      "allDay": false,
      "color": "blueberry",
      "location": "Conference Room A",
      "recurrence": { "type": "weekly" },
      "attendees": [],
      "reminders": [{ "type": "notification", "minutesBefore": 15 }],
      "visibility": "private"
    }
  ]
}
```

### Get Single Event
```http
GET /api/events/:id
```

Returns one specific event by its ID.
### Create Event
```http
POST /api/events
```

Send this to create a new event. The server will check for conflicts and return the created event.

**What to send:**
```json
{
  "title": "Team Meeting",
  "description": "Weekly sync",
  "startTime": "2024-01-15T14:00:00Z",
  "endTime": "2024-01-15T15:00:00Z",
  "allDay": false,
  "color": "blueberry",
  "location": "Conference Room A",
  "recurrence": { "type": "weekly" },
  "attendees": [
    {
      "email": "john@example.com",
      "name": "John Doe",
      "status": "invited"
    }
  ],
  "reminders": [
    {
      "type": "notification",
      "minutesBefore": 15
    }
  ],
  "visibility": "private"
}
```

**Validation:**
- Title is required
- End time must be after start time
- The server checks if it conflicts with other events

**Success Response (201):**
```json
{
  "success": true,
  "data": { /* your created event */ }
}
```

**Conflict Response (409):**
```json
{
  "success": false,
  "message": "Event conflicts with existing events",
  "conflicts": [
    {
      "id": "existing-event-id",
      "title": "Another Meeting",
      "startTime": "2024-01-15T14:30:00Z",
      "endTime": "2024-01-15T15:30:00Z"
    }
  ]
}
```

### Update Event
```http
PUT /api/events/:id
```

Change any field of an existing event.

**What to send** (any fields you want to update):
```json
{
  "title": "New Title",
  "startTime": "2024-01-15T15:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated event */ }
}
```

### Delete Event
```http
DELETE /api/events/:id
```

Removes an event. That's it!

**Response:**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

### Search Events
```http
GET /api/events/search?query=meeting
```

Searches through all event titles and descriptions.

**Parameters:**
- `query` - What to search for (required)

**Response:**
```json
{
  "success": true,
  "data": [ /* matching events */ ]
}
```

## 🔧 How I Organized the Code

```
src/
├── controllers/
│   └── eventController.js   # Handles all the logic for each endpoint
├── models/
│   └── Event.js             # Defines what an event looks like in MongoDB
├── routes/
│   └── events.js            # URL routes (GET /events, POST /events, etc)
├── middleware/
│   └── errorHandler.js      # Catches and formats errors
├── utils/
│   └── eventUtils.js        # Helper functions (check conflicts, etc)
└── index.js                 # Main server file
```

## 📊 Event Data Structure

Here's what gets stored in MongoDB for each event:

```javascript
{
  id: "abc-123-uuid",          // Unique ID
  title: "Team Meeting",        // Event name (required)
  description: "Weekly sync",   // Optional description
  startTime: "2024-01-15T14:00:00Z",  // When it starts
  endTime: "2024-01-15T15:00:00Z",    // When it ends
  allDay: false,               // Is it an all-day event?
  color: "blueberry",          // Color to display
  location: "Conference Room A", // Where it is
  recurrence: {                // Does it repeat?
    type: "weekly",            // daily, weekly, monthly, yearly, or none
    endDate: null,             // Stop repeating after this date
    daysOfWeek: [1]            // 0=Sunday, 1=Monday, etc.
  },
  attendees: [                 // Who's invited?
    {
      email: "john@example.com",
      name: "John Doe",
      status: "invited"        // or accepted, declined, tentative
    }
  ],
  reminders: [                 // When to remind
    {
      type: "notification",    // notification or email
      minutesBefore: 15        // Remind 15 minutes before
    }
  ],
  visibility: "private",       // private, public, confidential
  createdAt: "2024-01-15T10:00:00Z",  // When this was created
  updatedAt: "2024-01-15T10:00:00Z"   // Last time it was edited
}
```

## 💡 Key Features & How They Work

### Recurring Events
When you create an event that repeats (like "every Monday"), I only store it once in the database with the recurrence info. When the frontend asks for events in a date range, the server automatically expands it into individual instances.

**Example:**
- Store once: "Team Standup - Every Monday"
- Query: "Give me events for January 2024"
- Returns: 4 separate event instances (one for each Monday in January)

Each instance gets a unique ID like `abc123-20240101` so you can edit individual ones if needed.

### Conflict Detection
Before letting you create or update an event, the server checks if it overlaps with any other events. If it does, you get back information about the conflict.

**How it checks:**
Two events overlap if:
- Event A starts before Event B ends, AND
- Event A ends after Event B starts

### Timezone Handling
All times are stored in UTC. The frontend is responsible for displaying them in the user's timezone. This makes the backend simple and reliable across different regions.

## 🗄️ Database

### MongoDB Connection
Default setup connects to: `mongodb://localhost:27017/google-calendar-clone`

For cloud MongoDB (Atlas), use the connection string they give you.

### Indexes
I added indexes to make queries fast:
- Index on `startTime` and `endTime` - for date range queries
- Text index on `title` and `description` - for search
- Unique index on `id` - no duplicate events

## 🔐 Security

- All inputs are validated before being saved
- Error messages are formatted so they don't leak sensitive info
- Event IDs use UUID v4 to prevent guessing
- Visibility settings are stored (ready for privacy rules later)
- CORS is configured to only accept requests from your frontend

## 🧪 Error Handling

### HTTP Status Codes I Use
- `200 OK` - Request succeeded, here's your data
- `201 Created` - New event created successfully
- `400 Bad Request` - You sent bad data (missing field, wrong format, etc.)
- `404 Not Found` - Event doesn't exist
- `409 Conflict` - Event overlaps with another one
- `500 Server Error` - Something went wrong on my end

### Error Format
All errors come back looking like this:
```json
{
  "success": false,
  "message": "Title is required",
  "errors": ["title: event title is required"]
}
```

## 🚀 Performance

### Query Speed
- Date range queries are fast because of database indexes
- Text search works quickly even with thousands of events
- Ready to add pagination if it gets really big

### Scalability
- Recurring events are computed on request (no huge expansion stored)
- MongoDB can handle millions of events
- If you get really big, can add caching for frequently accessed dates

## � Debugging

### Check if it's Running
```bash
curl http://localhost:5000/api/health
```

You should get a response like `{"success": true}`.

### Common Problems

**MongoDB won't connect:**
- Is MongoDB running? Try `mongod`
- Is your connection string right in `.env`?
- If using MongoDB Atlas, check network access settings

**Port 5000 already in use:**
- Something else is using it
- Change PORT in `.env` to something like 5001
- Or kill the other process

**CORS errors from frontend:**
- Make sure frontend and backend are on the right ports
- Check that CORS is enabled in `index.js`
- Make sure frontend .env has correct API_URL

## 📦 What I Used

- **express** - Web framework
- **mongoose** - Talks to MongoDB
- **dotenv** - Loads .env settings
- **cors** - Allows frontend to talk to backend
- **uuid** - Generates unique IDs
- **date-fns** - Date math

## 🔄 Development

Typical workflow:
1. Make a change to a file
2. Server auto-reloads (thanks nodemon!)
3. Test the endpoint with Postman or `curl`
4. Check MongoDB to see if data was saved

## 📝 Random Notes

- Event IDs are UUIDs - makes them globally unique
- All times are stored in UTC to avoid timezone issues
- Recurring events are expanded on-the-fly, not stored as separate records
- The frontend does the conflict checking UI - backend just validates
- Future: could add user accounts and shared calendars
- Future: could add syncing with Google Calendar API

---

**Version**: 1.0.0
