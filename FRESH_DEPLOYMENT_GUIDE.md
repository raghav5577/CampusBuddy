# 🚀 Fresh Deployment Guide for CampusBuddy

## Prerequisites
- GitHub account with this repository
- Vercel account (free tier is fine)
- Render account (free tier is fine)
- MongoDB Atlas account with a database

---

## Part 1: Backend Deployment on Render

### Step 1: Delete Old Render Deployment (if exists)
1. Go to https://dashboard.render.com/
2. Find your old CampusBuddy service
3. Click on it → Settings (bottom of sidebar)
4. Scroll down → Click "Delete Web Service"
5. Confirm deletion

### Step 2: Create New Render Web Service
1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `raghav5577/CampusBuddy`
4. Configure the service:
   ```
   Name: campusbuddy-api (or your preferred name)
   Region: Singapore (or closest to you)
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

### Step 3: Set Environment Variables on Render
Click **"Environment"** tab and add these variables:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=<your_mongodb_atlas_connection_string>
JWT_SECRET=<your_secure_random_secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=<will_add_after_vercel_deployment>
```

**Important Notes:**
- Get MongoDB URI from MongoDB Atlas → Connect → Drivers
- Generate JWT_SECRET: Use a long random string (40+ characters)
- Leave CLIENT_URL empty for now, we'll update it after Vercel deployment

### Step 4: Deploy Backend
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Copy your Render URL (e.g., `https://campusbuddy-api-xyz.onrender.com`)
4. Test it by visiting: `https://your-render-url.onrender.com/api/health`
   - Should show: `{"status":"ok","message":"CampusBuddy server is running"}`

---

## Part 2: Frontend Deployment on Vercel

### Step 1: Delete Old Vercel Deployment (if exists)
1. Go to https://vercel.com/dashboard
2. Find your old CampusBuddy project
3. Click on it → Settings
4. Scroll to bottom → "Delete Project"
5. Confirm deletion

### Step 2: Create New Vercel Project
1. Go to https://vercel.com/new
2. Import your GitHub repository: `raghav5577/CampusBuddy`
3. Configure the project:
   ```
   Project Name: campusbuddy (or your preferred name)
   Framework Preset: Vite
   Root Directory: ./ (leave as root)
   Build Command: cd client && npm install && npm run build
   Output Directory: client/dist
   Install Command: npm install
   ```

### Step 3: Set Environment Variables (OPTIONAL)
Go to **Settings** → **Environment Variables** and add:

```
VITE_API_URL=https://your-render-url.onrender.com/api
VITE_SOCKET_URL=https://your-render-url.onrender.com
```

**Note:** This is optional because your `config.js` auto-detects production URLs!

### Step 4: Deploy Frontend
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Copy your Vercel URL (e.g., `https://campusbuddy-xyz.vercel.app`)

---

## Part 3: Link Frontend & Backend

### Step 1: Update Render Environment Variables
1. Go back to Render Dashboard → Your Service → Environment
2. Update `CLIENT_URL` to your Vercel URL:
   ```
   CLIENT_URL=https://campusbuddy-xyz.vercel.app
   ```
3. Click **"Save Changes"**
4. Render will automatically redeploy (wait 2-3 minutes)

### Step 2: Update Server CORS (if needed)
If you have a different Vercel URL, update the server CORS:

1. Edit `server/server.js`
2. Find the `allowedOrigins` array
3. Update the Vercel URL:
   ```javascript
   const allowedOrigins = [
       'http://localhost:5173',
       'http://localhost:5174',
       'http://127.0.0.1:5173',
       'https://your-actual-vercel-url.vercel.app', // UPDATE THIS
       process.env.CLIENT_URL
   ].filter(Boolean);
   ```
4. Commit and push changes:
   ```bash
   git add server/server.js
   git commit -m "Update CORS for new Vercel URL"
   git push origin main
   ```
5. Render will auto-deploy the update

---

## Part 4: Testing Your Deployment

### Test Backend
1. Visit: `https://your-render-url.onrender.com/api/health`
   - ✅ Should show: `{"status":"ok","message":"CampusBuddy server is running"}`
   - ⚠️ First request may take 30-60 seconds (free tier wakes up)

### Test Frontend
1. Visit your Vercel URL: `https://your-vercel-url.vercel.app`
2. Check browser console (F12 → Console):
   - ✅ Should show API URL and Socket URL
   - ✅ Should see "Connected to server" with socket ID
   - ❌ No CORS errors

### Test Full Flow
1. **Register** a new user
2. **Login** with that user
3. **Browse outlets** - should load from backend
4. **Add items to cart**
5. **Place an order**
6. **Check My Orders** page - should show your order

### Test Admin Dashboard
1. Go to MongoDB Atlas → Browse Collections
2. Find your user in `users` collection
3. Edit the user document:
   ```json
   {
     "role": "admin",
     "outletId": "<copy_an_outlet_id_from_outlets_collection>"
   }
   ```
4. Logout and login again
5. You should see Admin Dashboard
6. Test changing order status
7. Check if live updates work (open My Orders page in another browser/tab)

---

## 🐛 Troubleshooting

### Issue: Backend shows "Application failed to respond"
**Solution:**
- Check Render logs: Dashboard → Your Service → Logs
- Ensure MongoDB connection string is correct
- Ensure all environment variables are set

### Issue: Frontend shows "Failed to fetch" or "Network Error"
**Solution:**
- Wait 60 seconds for Render backend to wake up
- Check if backend health endpoint works
- Verify API_URL in browser console
- Check CORS settings on backend

### Issue: CORS errors in browser console
**Solution:**
- Ensure `CLIENT_URL` on Render matches your Vercel URL exactly
- Update `allowedOrigins` in `server/server.js`
- Redeploy backend after changes

### Issue: Socket.IO not connecting
**Solution:**
- Check browser console for Socket connection logs
- Ensure SOCKET_URL is correct (should be same as API_URL without `/api`)
- Restart both frontend and backend deployments

### Issue: Authentication not working
**Solution:**
- Check if JWT_SECRET is set on Render
- Clear browser localStorage and try again
- Check browser console for auth errors

---

## 📝 Important URLs to Save

After deployment, save these URLs:

```
Backend (Render): https://_____.onrender.com
Frontend (Vercel): https://_____.vercel.app
MongoDB Atlas: https://cloud.mongodb.com
Backend Health: https://_____.onrender.com/api/health
```

---

## 🔄 Future Deployments

After the initial setup, deployments are automatic:

1. **Make changes locally**
2. **Test locally** (npm run dev in both folders)
3. **Commit changes**: `git add . && git commit -m "description"`
4. **Push to GitHub**: `git push origin main`
5. **Auto-deploy**: Vercel and Render will detect the push and redeploy automatically
6. **Wait 2-5 minutes** for both to complete

---

## ✅ Deployment Checklist

Use this checklist to ensure everything is set up correctly:

### Backend (Render)
- [ ] New web service created
- [ ] Root directory set to `server`
- [ ] All environment variables set (NODE_ENV, PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN, CLIENT_URL)
- [ ] Deployment successful
- [ ] Health endpoint returns OK: `/api/health`
- [ ] No errors in Render logs

### Frontend (Vercel)
- [ ] New project created
- [ ] Build command: `cd client && npm install && npm run build`
- [ ] Output directory: `client/dist`
- [ ] Deployment successful
- [ ] Site loads without errors
- [ ] API calls working (check browser console)
- [ ] Socket.IO connected (check browser console)

### Integration
- [ ] CLIENT_URL on Render matches Vercel URL
- [ ] CORS configured correctly on backend
- [ ] MongoDB connection working
- [ ] User registration working
- [ ] User login working
- [ ] Outlets loading on homepage
- [ ] Cart and orders working
- [ ] Admin dashboard accessible (after setting role)
- [ ] Live order updates working

---

## 🎉 Success!

If all checklist items are complete, your app is fully deployed and working!

Access your app at: **https://your-vercel-url.vercel.app**

Need help? Check the logs:
- **Vercel logs**: Dashboard → Your Project → Deployments → View Function Logs
- **Render logs**: Dashboard → Your Service → Logs (real-time)
- **Browser logs**: F12 → Console tab
