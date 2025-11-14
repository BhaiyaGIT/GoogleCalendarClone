# 🔧 Technical Specifications - Google Calendar Clone

## System Architecture

### Frontend Architecture

```
┌─────────────────────────────────────────────┐
│           React Application                  │
├─────────────────────────────────────────────┤
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │        App Component (Root)          │   │
│  └──────────────────────────────────────┘   │
│                   │                         │
│        ┌──────────┴──────────┐              │
│        │                     │              │
│  ┌─────────────────┐  ┌─────────────────┐  │
│  │ CalendarMonth   │  │  EventModal     │  │
│  │                 │  │                 │  │
│  │ - Grid layout   │  │ - Form fields   │  │
│  │ - Day cells     │  │ - Validation    │  │
│  │ - Navigation    │  │ - API calls     │  │
│  └─────────────────┘  └─────────────────┘  │
│        │                     │              │
│        └──────────┬──────────┘              │
│                   │                         │
│  ┌────────────────────────────────────────┐ │
│  │    Zustand Store (State Management)    │ │
│  │ - Events array                         │ │
│  │ - Selected event                       │ │
│  │ - Modal state                          │ │
│  │ - Async actions                        │ │
│  └────────────────────────────────────────┘ │
│                   │                         │
│  ┌────────────────────────────────────────┐ │
│  │        API Client (Axios)              │ │
│  │ - Event CRUD operations                │ │
│  │ - Error handling                       │ │
│  │ - Request/response formatting          │ │
│  └────────────────────────────────────────┘ │
│                   │                         │
└───────────────────┼─────────────────────────┘
                    │
            ┌───────▼────────┐
            │  Backend API   │
            │ http://...5000 │
            └────────────────┘
```

### Backend Architecture

```
┌──────────────────────────────────────────────┐
│        Express.js Server                      │
├──────────────────────────────────────────────┤
│                                               │
│  ┌────────────────────────────────────────┐  │
│  │      HTTP Request                      │  │
│  │  /api/events (GET, POST, PUT, DELETE)  │  │
│  └────────────────────────────────────────┘  │
│                   │                          │
│  ┌────────────────▼────────────────────────┐ │
│  │   CORS Middleware                       │ │
│  │   - Allow localhost:3000                │ │
│  │   - Allow credentials                   │ │
│  └────────────────────────────────────────┘ │
│                   │                          │
│  ┌────────────────▼────────────────────────┐ │
│  │   Routes (events.js)                    │ │
│  │   - GET /                               │ │
│  │   - GET /:id                            │ │
│  │   - GET /search                         │ │
│  │   - POST /                              │ │
│  │   - PUT /:id                            │ │
│  │   - DELETE /:id                         │ │
│  └────────────────────────────────────────┘ │
│                   │                          │
│  ┌────────────────▼────────────────────────┐ │
│  │   Controllers (eventController.js)      │ │
│  │   - Business logic                      │ │
│  │   - Validation                          │ │
│  │   - Error handling                      │ │
│  └────────────────────────────────────────┘ │
│                   │                          │
│  ┌────────────────▼────────────────────────┐ │
│  │   Utilities (eventUtils.js)             │ │
│  │   - Recurring expansion                 │ │
│  │   - Conflict detection                  │ │
│  │   - Date utilities                      │ │
│  └────────────────────────────────────────┘ │
│                   │                          │
│  ┌────────────────▼────────────────────────┐ │
│  │   Models (Event.js - Mongoose)          │ │
│  │   - Schema definition                   │ │
│  │   - Validation                          │ │
│  │   - Indexes                             │ │
│  └────────────────────────────────────────┘ │
│                   │                          │
│  ┌────────────────▼────────────────────────┐ │
│  │   Error Handler Middleware              │ │
│  │   - Error formatting                    │ │
│  │   - Status codes                        │ │
│  │   - Error logging                       │ │
│  └────────────────────────────────────────┘ │
│                   │                          │
└───────────────────┼──────────────────────────┘
                    │
            ┌───────▼────────┐
            │   MongoDB      │
            │  Database      │
            └────────────────┘
```

## Data Flow Diagram

### Event Creation Flow

```
User Input
    │
    ▼
┌──────────────────────────┐
│  EventModal Component    │
│  - Form validation       │
│  - State management      │
└──────────────────────────┘
    │ onSubmit
    ▼
┌──────────────────────────┐
│  Zustand Store           │
│  - createEvent action    │
│  - Set loading state     │
└──────────────────────────┘
    │ await eventAPI.createEvent
    ▼
┌──────────────────────────┐
│  API Client (Axios)      │
│  - POST /api/events      │
│  - Send form data        │
└──────────────────────────┘
    │ HTTP POST
    ▼
┌──────────────────────────┐
│  Backend Server          │
│  - Receive request       │
│  - Validate input        │
└──────────────────────────┘
    │
    ▼
┌──────────────────────────┐
│  Event Controller        │
│  - Check conflicts       │
│  - Generate UUID         │
│  - Create event object   │
└──────────────────────────┘
    │
    ▼
┌──────────────────────────┐
│  Event Model             │
│  - Validate schema       │
│  - Check constraints     │
│  - Save to database      │
└──────────────────────────┘
    │
    ▼
┌──────────────────────────┐
│  MongoDB                 │
│  - Store event document  │
│  - Return saved object   │
└──────────────────────────┘
    │ Response 201
    ▼
┌──────────────────────────┐
│  Backend - Send Response │
│  - Success JSON          │
│  - Event data            │
└──────────────────────────┘
    │ Response
    ▼
┌──────────────────────────┐
│  Zustand Store           │
│  - Add to events array   │
│  - Close modal           │
│  - Clear form            │
└──────────────────────────┘
    │
    ▼
┌──────────────────────────┐
│  CalendarMonth Re-render │
│  - Update UI             │
│  - Show new event        │
│  - Animation             │
└──────────────────────────┘
    │
    ▼
User Sees Event
```

## API Specification

### Base Configuration
- **Base URL**: `http://localhost:5000/api`
- **Default Port**: 5000
- **Protocol**: HTTP/HTTPS
- **Auth**: None (extensible)

### Request/Response Format

**Request Headers:**
```
Content-Type: application/json
```

**Response Format:**
```json
{
  "success": boolean,
  "data": object | array,
  "message": string,
  "errors": array
}
```

### Event Object Structure

```javascript
{
  // Unique Identifier
  id: String (UUID v4),
  
  // Basic Information
  title: String (1-255 chars),
  description: String (0-2000 chars),
  
  // Time Information
  startTime: ISO8601 Date,
  endTime: ISO8601 Date,
  allDay: Boolean,
  
  // Styling
  color: String (enum),
  
  // Location
  location: String,
  
  // Recurrence
  recurrence: {
    type: String (none|daily|weekly|monthly|yearly),
    endDate: Date,
    daysOfWeek: Number[]
  },
  
  // Attendees
  attendees: Array<{
    email: String,
    name: String,
    status: String (invited|accepted|declined|tentative)
  }>,
  
  // Notifications
  reminders: Array<{
    type: String (notification|email),
    minutesBefore: Number
  }>,
  
  // Access Control
  visibility: String (public|private|confidential),
  
  // Recurring Info
  isRecurringInstance: Boolean,
  recurringEventId: String,
  parentRecurringEvent: ObjectId,
  
  // Metadata
  createdAt: Date,
  updatedAt: Date
}
```

## Database Schema

### Event Collection

```javascript
{
  _id: ObjectId (MongoDB Auto),
  id: String (Unique),
  title: String (Required, Index for search),
  description: String,
  startTime: Date (Index, Required),
  endTime: Date (Index, Required),
  allDay: Boolean,
  color: String,
  location: String,
  recurrence: {
    type: String,
    endDate: Date,
    daysOfWeek: [Number]
  },
  attendees: [{
    email: String,
    name: String,
    status: String
  }],
  reminders: [{
    type: String,
    minutesBefore: Number
  }],
  visibility: String,
  isRecurringInstance: Boolean,
  recurringEventId: String,
  parentRecurringEvent: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

```javascript
// Primary indexes
db.events.createIndex({ startTime: 1, endTime: 1 })
db.events.createIndex({ id: 1 }, { unique: true })

// Text search index
db.events.createIndex({ title: "text", description: "text" })

// Foreign key index
db.events.createIndex({ parentRecurringEvent: 1 })
```

## Component Hierarchy

```
App
├── CalendarMonth
│   ├── Month Header
│   │   ├── Title (Month/Year)
│   │   ├── Today Button
│   │   └── Navigation Buttons
│   ├── Week Header
│   │   └── Day Names (Sun-Sat)
│   └── Days Grid
│       ├── Day Cell (x42)
│       │   ├── Day Number
│       │   ├── Add Event Button
│       │   └── Event Cards (max 3)
│       └── More Events Indicator
└── EventModal
    ├── Modal Header
    │   ├── Title (Create/Edit)
    │   └── Close Button
    ├── Form Fields
    │   ├── Title Input
    │   ├── Description Textarea
    │   ├── Date/Time Inputs
    │   ├── All-day Toggle
    │   ├── Location Input
    │   ├── Color Picker
    │   ├── Recurrence Select
    │   ├── Reminders Section
    │   ├── Attendees Section
    │   └── Visibility Select
    └── Actions
        ├── Delete Button
        ├── Cancel Button
        └── Save Button
```

## State Management (Zustand Store)

### Store Structure

```javascript
const useCalendarStore = create((set, get) => ({
  // State
  state: {
    events: [],
    selectedEvent: null,
    isModalOpen: false,
    currentDate: Date,
    view: 'month',
    searchQuery: '',
    isLoading: false,
    error: null
  },
  
  // Synchronous Actions
  actions: {
    setEvents: (events) => void,
    setSelectedEvent: (event) => void,
    setIsModalOpen: (isOpen) => void,
    setCurrentDate: (date) => void,
    setView: (view) => void,
    setSearchQuery: (query) => void,
    setIsLoading: (loading) => void,
    setError: (error) => void,
    closeModal: () => void,
    openEventModal: (event) => void,
    openNewEventModal: () => void
  },
  
  // Async Actions
  asyncActions: {
    fetchEvents: async (startDate, endDate) => void,
    createEvent: async (eventData) => Event,
    updateEvent: async (id, eventData) => Event,
    deleteEvent: async (id) => void,
    searchEvents: async (query) => void
  }
}))
```

## Error Handling Strategy

### Frontend Error Handling

```
User Action
    │
    ▼
Form Validation
    ├─ Valid → Proceed
    └─ Invalid → Show Error Message
        
API Call
    ├─ Success → Update State
    └─ Error
        ├─ Network Error → Show Connection Error
        ├─ Validation Error → Show Field Errors
        ├─ Conflict Error → Show Conflict Warning
        └─ Server Error → Show Generic Error
        
Error Recovery
    ├─ Retry Button
    ├─ Auto-retry (on network)
    └─ Clear Error on New Action
```

### Backend Error Handling

```
HTTP Request
    │
    ▼
Input Validation
    ├─ Valid → Process Request
    └─ Invalid → Return 400 with errors
    
Business Logic
    ├─ Success → Return 200/201
    └─ Error
        ├─ Not Found → 404
        ├─ Conflict → 409
        ├─ Database Error → 500
        └─ Validation Error → 400
        
Error Response
    {
      "success": false,
      "message": "Human readable message",
      "errors": ["specific error 1", "specific error 2"]
    }
```

## Performance Metrics

### Frontend Performance

| Metric | Target | Optimization |
|--------|--------|---------------|
| Initial Load | < 2s | Code splitting, lazy loading |
| First Interaction | < 100ms | Optimized re-renders |
| Animation FPS | 60fps | GPU acceleration |
| Bundle Size | < 500KB | Tree shaking, minification |
| Time to Interactive | < 3s | Efficient hydration |

### Backend Performance

| Metric | Target | Optimization |
|--------|--------|---------------|
| Avg Response Time | < 100ms | Database indexing |
| P95 Response Time | < 500ms | Query optimization |
| Throughput | > 100 req/s | Connection pooling |
| Database Query | < 50ms | Indexed queries |
| Error Rate | < 0.1% | Validation, error handling |

## Scalability Considerations

### Frontend Scaling
- Component reusability
- Virtual scrolling for lists
- Code splitting
- Lazy loading
- Caching strategies

### Backend Scaling
- Database sharding (horizontal)
- Caching layer (Redis)
- Load balancing
- API versioning
- Rate limiting

### Database Scaling
- Indexes for efficiency
- Archiving old events
- Partitioning by date
- Backup strategies
- Replica sets

## Security Measures

### Input Security
- Validation on frontend
- Validation on backend
- Input sanitization
- Type checking

### Network Security
- HTTPS/SSL (production)
- CORS configuration
- Request headers validation
- Rate limiting

### Data Security
- No hardcoded secrets
- Environment variables
- Secure storage
- Access control

## Testing Strategy

### Unit Tests
```
Backend:
- Event model validation
- Utility function logic
- Controller functions
- Error handling

Frontend:
- Component rendering
- User interactions
- Store actions
- Utility functions
```

### Integration Tests
```
API Endpoints:
- Create event flow
- Update event flow
- Delete event flow
- Search functionality

Component Integration:
- Modal ↔ Store
- Store ↔ API
- Components ↔ Animations
```

### E2E Tests
```
Complete Flows:
- User creates event
- User edits event
- User deletes event
- User navigates calendar
- User searches events
```

## Deployment Pipeline

### Build Process
```
Frontend:
npm run build
├─ Compile JSX
├─ Bundle files
├─ Minify code
├─ Generate source maps
└─ Output to build/

Backend:
npm run build (if transpiling)
├─ Check syntax
├─ Run tests
├─ Create package
└─ Ready for deployment
```

### Deployment Targets

**Frontend:**
- Vercel (Recommended)
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

**Backend:**
- Heroku
- Railway
- AWS EC2 / ECS
- DigitalOcean
- Azure App Service

**Database:**
- MongoDB Atlas (Cloud)
- AWS DocumentDB
- Self-hosted MongoDB

## Monitoring & Logging

### Logging
```
Backend:
- HTTP request logging
- Database query logging
- Error logging
- Performance metrics

Frontend:
- Console errors
- API call tracking
- User interaction tracking
- Performance metrics
```

### Monitoring (Production)
```
Performance:
- Response times
- Error rates
- Database performance
- User experience metrics

Health Checks:
- API availability
- Database connectivity
- Service status
- Resource usage
```

## Version Control Strategy

```
main (Production)
├─ develop (Integration)
│  ├─ feature/event-creation
│  ├─ feature/week-view
│  ├─ bugfix/conflict-detection
│  └─ enhancement/dark-mode
```

---

**Technical Stack Summary**
- Frontend: React 18 + Zustand + Framer Motion
- Backend: Express.js
- Database: MongoDB + Mongoose
- HTTP: Axios
- Dates: date-fns
- Icons: lucide-react
- Deployment: Ready for cloud platforms
