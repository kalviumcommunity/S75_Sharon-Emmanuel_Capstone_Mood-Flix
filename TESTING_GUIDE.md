# 🧪 MoodFlix Testing Guide

This guide will help you test all features of the MoodFlix application.

## Prerequisites

1. ✅ Backend server running on `http://localhost:5000`
2. ✅ Frontend server running on `http://localhost:5173`
3. ✅ MongoDB connected (local or Atlas)
4. ✅ TMDb API key configured in backend `.env`

## Test Checklist

### 1. Authentication Tests

#### 1.1 User Registration
- [ ] Navigate to `/signup`
- [ ] Fill in name, email, password
- [ ] Submit form
- [ ] Verify redirect to mood selection
- [ ] Check that user is logged in

**Test Cases:**
- Valid registration ✅
- Duplicate email (should show error)
- Weak password < 6 characters (should show error)
- Missing fields (should show validation errors)

#### 1.2 User Login
- [ ] Navigate to `/login`
- [ ] Enter registered email and password
- [ ] Submit form
- [ ] Verify redirect to mood selection
- [ ] Check that user is logged in

**Test Cases:**
- Valid login ✅
- Wrong password (should show error)
- Non-existent email (should show error)
- Missing fields (should show validation errors)

#### 1.3 Protected Routes
- [ ] Try accessing `/mood-selection` without login (should redirect to login)
- [ ] Try accessing `/watchlist` without login (should redirect to login)
- [ ] Login and verify access to protected routes

### 2. Mood Selection Tests

#### 2.1 Mood Selection Page
- [ ] Navigate to `/mood-selection` (after login)
- [ ] Verify all 10 moods are displayed
- [ ] Click on a current mood (should highlight)
- [ ] Click on a desired mood (should highlight)
- [ ] Click "Get Recommendations" button

**Test Cases:**
- Select only current mood ✅
- Select only desired mood ✅
- Select both moods ✅
- Select no mood (should show error)

### 3. Movie Recommendations Tests

#### 3.1 Get Recommendations
- [ ] Select a mood and get recommendations
- [ ] Verify movies are displayed in grid
- [ ] Check movie cards show: poster, title, year, rating
- [ ] Click on a movie card (should navigate to details)

#### 3.2 Filters
- [ ] Click "Filters" button
- [ ] Set minimum rating (e.g., 7.0)
- [ ] Set maximum rating (e.g., 9.0)
- [ ] Set year filter (e.g., 2020)
- [ ] Change sort by option
- [ ] Verify filtered results
- [ ] Click "Clear Filters"

**Test Cases:**
- Filter by rating range ✅
- Filter by year ✅
- Sort by popularity ✅
- Sort by rating ✅
- Sort by release date ✅

#### 3.3 Pagination
- [ ] Navigate through pages
- [ ] Verify page numbers update
- [ ] Check "Previous" button disabled on page 1
- [ ] Check "Next" button disabled on last page

### 4. Movie Details Tests

#### 4.1 Movie Details Page
- [ ] Click on a movie from recommendations
- [ ] Verify movie details load
- [ ] Check all information displays: title, overview, genres, rating, runtime
- [ ] Verify poster and backdrop images

#### 4.2 Watchlist Actions
- [ ] Click "Add to Watchlist" button
- [ ] Verify button changes to "Remove from Watchlist"
- [ ] Click "Remove from Watchlist"
- [ ] Verify button changes back

#### 4.3 Rating System
- [ ] Click on star ratings (1-5)
- [ ] Verify rating is saved
- [ ] Refresh page and verify rating persists
- [ ] Change rating and verify update

### 5. Watchlist Tests

#### 5.1 View Watchlist
- [ ] Navigate to `/watchlist`
- [ ] Verify all added movies are displayed
- [ ] Check movie cards show correct information

#### 5.2 Watchlist Actions
- [ ] Mark movie as watched (checkmark button)
- [ ] Mark movie as unwatched
- [ ] Remove movie from watchlist (trash button)
- [ ] Verify updates reflect immediately

### 6. Profile Tests

#### 6.1 View Profile
- [ ] Navigate to `/profile`
- [ ] Verify current user information displays

#### 6.2 Update Profile
- [ ] Change name
- [ ] Submit form
- [ ] Verify update success message
- [ ] Check name updates in navbar

### 7. Admin Dashboard Tests

#### 7.1 Access Admin Dashboard
- [ ] Login as admin user (role: 'admin')
- [ ] Navigate to `/admin`
- [ ] Verify dashboard loads

**Note:** To create an admin user, you need to manually update the user in MongoDB:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

#### 7.2 View Statistics
- [ ] Check total users count
- [ ] Check total watchlists count
- [ ] Check total ratings count
- [ ] Check total feedback count

#### 7.3 Manage Users
- [ ] View users table
- [ ] Verify all users are listed
- [ ] Check user information displays correctly

### 8. Feedback Tests

#### 8.1 Submit Feedback
- [ ] Navigate to `/feedback`
- [ ] Fill in all fields
- [ ] Submit form
- [ ] Verify success message
- [ ] Check form clears

**Test Cases:**
- Valid feedback submission ✅
- Missing fields (should show validation errors)
- Long message > 1000 chars (should show error)

### 9. UI/UX Tests

#### 9.1 Dark/Light Mode
- [ ] Click theme toggle in navbar
- [ ] Verify theme switches
- [ ] Refresh page and verify theme persists
- [ ] Check all pages respect theme

#### 9.2 Responsive Design
- [ ] Test on mobile viewport (< 640px)
- [ ] Test on tablet viewport (640px - 1024px)
- [ ] Test on desktop viewport (> 1024px)
- [ ] Verify all pages are responsive

#### 9.3 Navigation
- [ ] Test all navigation links
- [ ] Verify active states
- [ ] Check logout functionality
- [ ] Verify protected routes redirect

#### 9.4 Animations
- [ ] Check page transitions
- [ ] Verify hover effects on buttons
- [ ] Check loading animations
- [ ] Verify toast notifications

### 10. Error Handling Tests

#### 10.1 Network Errors
- [ ] Disconnect internet
- [ ] Try to fetch recommendations
- [ ] Verify error message displays

#### 10.2 Invalid Routes
- [ ] Navigate to `/invalid-route`
- [ ] Verify 404 page displays
- [ ] Check "Go Home" button works

#### 10.3 API Errors
- [ ] Use invalid TMDb API key
- [ ] Verify error handling
- [ ] Check user-friendly error messages

## API Testing with Postman/Bruno

### Authentication Endpoints

#### Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

#### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

#### Get Current User
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer <token>
```

### Movie Endpoints

#### Get Recommendations
```
GET http://localhost:5000/api/movies/recommend?currentMood=happy&desiredMood=excited&page=1
Authorization: Bearer <token>
```

#### Get Movie Details
```
GET http://localhost:5000/api/movies/550
```

#### Search Movies
```
GET http://localhost:5000/api/movies/search?query=inception&page=1
```

### Watchlist Endpoints

#### Get Watchlist
```
GET http://localhost:5000/api/watchlist
Authorization: Bearer <token>
```

#### Add to Watchlist
```
POST http://localhost:5000/api/watchlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "tmdbId": 550
}
```

### Rating Endpoints

#### Add Rating
```
POST http://localhost:5000/api/ratings
Authorization: Bearer <token>
Content-Type: application/json

{
  "tmdbId": 550,
  "rating": 5,
  "review": "Great movie!"
}
```

## Common Issues & Solutions

### Issue: Backend won't start
**Solution:** 
- Check MongoDB is running
- Verify `.env` file exists and has correct values
- Check port 5000 is not in use

### Issue: Frontend can't connect to backend
**Solution:**
- Verify backend is running
- Check `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend

### Issue: TMDb API errors
**Solution:**
- Verify API key is correct in backend `.env`
- Check API key hasn't exceeded rate limit
- Ensure API key has proper permissions

### Issue: MongoDB connection error
**Solution:**
- Check MongoDB is running (if local)
- Verify connection string in `.env`
- For Atlas, check IP whitelist

## Performance Testing

1. **Load Time:** Check initial page load < 2 seconds
2. **API Response:** Verify API responses < 1 second
3. **Image Loading:** Check movie posters load efficiently
4. **Pagination:** Test with large result sets

## Security Testing

1. **JWT Tokens:** Verify tokens expire correctly
2. **Protected Routes:** Ensure unauthorized access is blocked
3. **Input Validation:** Test XSS and SQL injection prevention
4. **Password Security:** Verify passwords are hashed

---

**Happy Testing! 🎬**

If you encounter any issues, check the browser console and terminal for error messages.
