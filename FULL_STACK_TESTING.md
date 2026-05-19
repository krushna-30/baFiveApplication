# baFive Full-Stack Integration Testing Guide

## Current Status

- ✅ **Frontend**: React + TypeScript (Running on localhost:5173)
- ✅ **Theme System**: 9 themes fully functional with React Context
- ✅ **UI Components**: Logo, 3D buttons, error handling, animations
- ⏳ **Backend**: Express server configured for port 5000 (Awaiting Node.js environment)
- ⏳ **Database**: SQLite setup ready (./data/bafive.db)

---

## Backend API Endpoints (Ready to Test)

### Authentication Routes (`/api/auth`)

#### 1. User Registration
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "department": "Engineering"
}

Response: {
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "department": "Engineering"
  },
  "token": "jwt_token"
}
```

#### 2. User Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: {
  "success": true,
  "user": { /* user object */ },
  "token": "jwt_token"
}
```

#### 3. Get Profile (Authenticated)
```
GET /api/auth/profile
Authorization: Bearer jwt_token

Response: {
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "department": "Engineering",
  "interests": ["Coffee", "Networking"]
}
```

---

### Profile Discovery Routes (`/api/profiles`)

#### 1. Get Random Profiles
```
GET /api/profiles/random?limit=5
Authorization: Bearer jwt_token

Response: [
  {
    "id": "uuid",
    "name": "Jane Smith",
    "department": "Marketing",
    "image": "avatar_url",
    "interests": ["Design", "Strategy"]
  }
]
```

#### 2. Get Profile by ID
```
GET /api/profiles/:profileId
Authorization: Bearer jwt_token

Response: { /* full profile object */ }
```

---

### Connections/Matching Routes (`/api/connections`)

#### 1. Like/Connect to Profile
```
POST /api/connections/like
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "profileId": "target_user_id",
  "action": "like"
}

Response: {
  "success": true,
  "match": false,
  "message": "Profile liked successfully"
}
```

#### 2. Get Matched Connections
```
GET /api/connections/matches
Authorization: Bearer jwt_token

Response: [
  {
    "id": "uuid",
    "name": "Jane Smith",
    "department": "Marketing",
    "matchedAt": "2026-05-19T10:00:00Z"
  }
]
```

---

### Messaging Routes (`/api/messages`)

#### 1. Send Message
```
POST /api/messages
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "recipientId": "user_id",
  "content": "Hey, let's connect!"
}

Response: {
  "success": true,
  "messageId": "uuid",
  "sentAt": "2026-05-19T10:00:00Z"
}
```

#### 2. Get Conversations
```
GET /api/messages/conversations
Authorization: Bearer jwt_token

Response: [
  {
    "conversationId": "uuid",
    "with": { /* user object */ },
    "lastMessage": "Hey, let's connect!",
    "timestamp": "2026-05-19T10:00:00Z"
  }
]
```

---

## Frontend Integration Checklist

- [ ] **Login Page Integration**
  - [ ] Test sign up → backend registration
  - [ ] Test login → backend authentication
  - [ ] Test error handling (401, 422, 500)
  - [ ] Test token storage in localStorage
  - [ ] Test demo user login

- [ ] **HomePage Integration**
  - [ ] Test profile discovery API call
  - [ ] Test profile card rendering
  - [ ] Test Like/Pass button → connections API
  - [ ] Test match notifications

- [ ] **MessagesPage Integration**
  - [ ] Test conversations list load
  - [ ] Test message sending
  - [ ] Test real-time updates (WebSocket ready)

- [ ] **ProfilePage Integration**
  - [ ] Test profile data fetch
  - [ ] Test profile edit submission
  - [ ] Test interest tags update

---

## Testing Approach (Without Live Backend)

### Option 1: Mock API Layer
Already set up in `src/services/api.ts` with mock responses for testing:

```typescript
// Example mock endpoints in api.ts
authAPI.login(email, password) 
  → Returns mock user + token if email/password match demo credentials
```

### Option 2: Use Browser DevTools
1. Open Chrome DevTools (F12)
2. Network tab → Intercept requests
3. Mock responses for API calls
4. Test UI responses to different data scenarios

### Option 3: Prepare Postman Collection
See `POSTMAN_COLLECTION.json` for ready-to-test API endpoints

---

## Deployment Checklist

When Node.js environment is available:

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Set Environment Variables**
   ```
   PORT=5000
   JWT_SECRET=your_production_secret_key
   NODE_ENV=production
   ```

3. **Initialize Database**
   ```bash
   node execute-schema.js
   ```

4. **Start Backend Server**
   ```bash
   npm start
   # or with auto-reload
   npm run dev
   ```

5. **Test Health Check**
   ```
   GET http://localhost:5000/health
   Expected: { status: 'OK', message: 'baFive Backend is running' }
   ```

---

## Demo Credentials (Test Account)

```
Email: demo@bafive.com
Password: demo123456
```

This account is pre-seeded with:
- 50+ colleague profiles
- 3 matched connections
- 5 message conversations

---

## Common Testing Scenarios

### Scenario 1: Complete User Onboarding
1. Sign up → New account created
2. Login → Token received and stored
3. View profiles → ProfilePage loads with 5 random profiles
4. Like profile → Connection created
5. Check matches → Mutual connections displayed

### Scenario 2: Messaging Flow
1. View matched connections list
2. Open conversation with matched user
3. Send message → Backend stores message
4. Receive confirmation
5. Message displays in conversation thread

### Scenario 3: Error Handling
1. Invalid credentials → 401 error displayed
2. Network timeout → Retry mechanism triggered
3. Server error (500) → User-friendly error message shown
4. Invalid token → Auto redirect to login

---

## Next Steps

1. ✅ Frontend fully styled and themed
2. ⏳ Deploy backend to Node.js environment
3. ⏳ Run integration tests against live endpoints
4. ⏳ Set up WebSocket for real-time messaging
5. ⏳ Deploy to production (Vercel/Heroku)

