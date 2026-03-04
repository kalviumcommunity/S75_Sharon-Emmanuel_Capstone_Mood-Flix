# 🚀 MoodFlix Setup Guide

This guide will help you set up the MoodFlix project on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas account) - [Download](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

## Step 1: Get TMDb API Key

1. Go to [TMDb](https://www.themoviedb.org/)
2. Create a free account
3. Go to Settings → API
4. Request an API key
5. Copy your API key (you'll need it in Step 3)

## Step 2: Backend Setup

### 2.1 Navigate to Backend Directory

```bash
cd backend
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Create Environment File

Create a `.env` file in the `backend` directory:

**Windows (PowerShell):**
```powershell
Copy-Item env.example.txt .env
```

**Mac/Linux:**
```bash
cp env.example.txt .env
```

Or manually create `.env` file with the following content:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/moodflix
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
TMDB_API_KEY=your-tmdb-api-key-here
TMDB_BASE_URL=https://api.themoviedb.org/3
FRONTEND_URL=http://localhost:5173
```

**Important:** Replace `your-tmdb-api-key-here` with your actual TMDb API key from Step 1.

### 2.4 MongoDB Setup

**Option A: Local MongoDB**
- Make sure MongoDB is running on your machine
- The default connection string `mongodb://localhost:27017/moodflix` should work

**Option B: MongoDB Atlas (Cloud)**
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string
- Replace `MONGODB_URI` in `.env` with your Atlas connection string

### 2.5 Start Backend Server

```bash
npm run dev
```

The backend should now be running on `http://localhost:5000`

You should see:
```
✅ MongoDB Connected: ...
🚀 Server running on port 5000
```

## Step 3: Frontend Setup

### 3.1 Open a New Terminal

Keep the backend running, and open a new terminal window.

### 3.2 Navigate to Frontend Directory

```bash
cd frontend
```

### 3.3 Install Dependencies

```bash
npm install
```

### 3.4 Create Environment File

Create a `.env` file in the `frontend` directory:

**Windows (PowerShell):**
```powershell
Copy-Item env.example.txt .env
```

**Mac/Linux:**
```bash
cp env.example.txt .env
```

Or manually create `.env` file with:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3.5 Start Frontend Development Server

```bash
npm run dev
```

The frontend should now be running on `http://localhost:5173`

## Step 4: Verify Installation

1. Open your browser and go to `http://localhost:5173`
2. You should see the MoodFlix homepage
3. Try creating an account or logging in
4. Navigate to "Get Recommendations" to test the mood selection

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Make sure MongoDB is running (if using local)
- Check your `MONGODB_URI` in `.env`
- For Atlas, ensure your IP is whitelisted

**Port Already in Use:**
- Change `PORT` in backend `.env` to a different port (e.g., 5001)
- Update `VITE_API_URL` in frontend `.env` accordingly

**TMDb API Errors:**
- Verify your API key is correct
- Check if you've exceeded the API rate limit

### Frontend Issues

**Cannot Connect to Backend:**
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend

**Build Errors:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Next Steps

Once everything is set up:

1. ✅ Create your first user account
2. ✅ Test mood selection
3. ✅ Get movie recommendations
4. ✅ Add movies to watchlist
5. ✅ Rate movies

## Development Commands

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
moodflix/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   └── server.js        # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── context/         # React Context
    │   ├── services/        # API services
    │   └── main.jsx         # Entry point
    └── package.json
```

## Need Help?

If you encounter any issues:
1. Check the error messages in the terminal
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that MongoDB is running (if using local)

Happy coding! 🎬
