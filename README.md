# CampusBuddy - Bennett University Food Ordering Platform 🍔

A MERN stack platform allowing students to pre-order meals from campus outlets and restaurants to manage orders in real-time.

## Features
- **Student Portal**: Browse outlets, view menus, cart system, order tracking.
- **Restaurant Dashboard**: Real-time KOT management (Accept, Prepare, Ready, Pickup).
- **Live Updates**: Socket.io integration for instant status changes.
- **Authentication**: Secure JWT login for Students and Admins.

## Prerequisites
- Node.js installed
- MongoDB (Atlas or Local)

## Setup & specific instructions

### 1. Configure Environment
Update `server/.env` with your MongoDB URI.
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
```

### 2. Install Dependencies
```bash
# Server
cd server
npm install

# Client
cd client
npm install
```

### 3. Seed Database
Populate the database with Bennett University outlets (Main Canteen, CCD, Subway, etc.):
```bash
cd server
npm run seed
```

### 4. Run Application
You need to run both Backend and Frontend.

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

## Admin Access
To access the specific Restaurant Dashboard, a user needs `role: "admin"` and an `outletId`.
1. Register a new user.
2. Manually update the document in MongoDB to set `role: "admin"` and assign an `outletId` from the `outlets` collection.
3. Login with that user to see the Dashboard.
