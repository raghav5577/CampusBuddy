# CampusBuddy Deployment Checklist ✅

## Quick Fix Summary
The issue was that your config was falling back to an incorrect URL in production. I've fixed:
1. ✅ Smart production/development detection in config
2. ✅ Improved Socket.IO configuration with retry logic
3. ✅ Enhanced CORS to handle multiple origins
4. ✅ Added debug page for troubleshooting

---

## 🚀 Deployment Steps

### 1. **Backend (Render)**

#### Set Environment Variables on Render:
Go to your Render Dashboard → Your Service → Environment → Add:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string_from_atlas
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-vercel-app.vercel.app
```

**Important:** Replace `your-vercel-app.vercel.app` with your actual Vercel domain!

#### Redeploy Backend:
- Click "Manual Deploy" → "Clear build cache & deploy"
- Wait for deployment to complete (~2-3 minutes)

---

### 2. **Frontend (Vercel)**

#### Option A: Let Auto-Detection Work (Recommended)
The code now automatically detects if you're on localhost or production! No environment variables needed.

#### Option B: Explicitly Set Environment Variables (Optional)
If you prefer explicit configuration, go to Vercel Dashboard → Your Project → Settings → Environment Variables:

```env
VITE_API_URL=https://campusbuddy-api.onrender.com/api
VITE_SOCKET_URL=https://campusbuddy-api.onrender.com
```

#### Redeploy Frontend:
- Go to Deployments → Click "..." → "Redeploy"
- Or push to your repo to trigger auto-deployment

---

## 🧪 Testing

### 1. **Test Backend Health**
Open in browser:
```
https://campusbuddy-api.onrender.com/api/health
```
You should see: `{"status":"ok","message":"CampusBuddy server is running"}`

**Note:** First request may take 30-60 seconds if the free tier was sleeping!

### 2. **Test Frontend Debug Page**
Visit your deployed site:
```
https://your-app.vercel.app/debug
```

This page will show:
- ✅ Current API and Socket URLs being used
- ✅ API connection status
- ✅ Socket.IO connection status
- ❌ Any errors if they occur

### 3. **Check Browser Console**
Open DevTools (F12) → Console tab:
- Look for: `✅ Connected to server: [socket-id]`
- Or errors: `❌ Connection error: [details]`

---

## 🐛 Troubleshooting

### Issue: "ERR_CONNECTION_TIMED_OUT" or "Failed to fetch"

**Cause:** Render free tier is sleeping

**Solution:**
1. Open backend URL in new tab first: `https://campusbuddy-api.onrender.com/api/health`
2. Wait 30-60 seconds for it to wake up
3. Refresh your frontend
4. The app should connect now

### Issue: "CORS Error" in console

**Cause:** Backend doesn't recognize your frontend URL

**Solution:**
1. Check your Render environment variables
2. Make sure `CLIENT_URL` matches your Vercel URL exactly
3. Include `https://` in the URL
4. Redeploy backend after changing env vars

### Issue: API works but Socket.IO fails

**Cause:** Socket configuration mismatch

**Solution:**
1. Check `/debug` page to verify Socket URL
2. Ensure backend Socket.IO is configured (already done ✅)
3. Wait longer - Socket.IO may retry connection automatically
4. Check browser console for retry attempts

### Issue: Still not working after all fixes

**Check:**
1. Visit `/debug` page - what do you see?
2. Browser console - any specific errors?
3. Render logs - Go to Dashboard → Logs
4. Is MongoDB connected? Check Render logs for connection
5. Are both deployments using latest code?

---

## 📝 Local Development

Everything still works locally! The config auto-detects:
- Localhost = uses `http://localhost:5000`
- Production = uses `https://campusbuddy-api.onrender.com`

### Run Locally:
```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
cd client
npm install
npm run dev
```

---

## 🔍 Quick Verification Commands

### Check what URL your deployed app is using:
1. Open your deployed site
2. Open browser console (F12)
3. Type: `localStorage` - check for any cached data
4. Visit `/debug` page

### Check if backend is awake:
```bash
curl https://campusbuddy-api.onrender.com/api/health
```

Should return: `{"status":"ok","message":"CampusBuddy server is running"}`

---

## 💡 Pro Tips

1. **Keep Backend Awake:** Use a service like UptimeRobot to ping your backend every 5 minutes (prevents sleeping)

2. **Environment Variables:** Use Vercel's environment variable preview to test before production

3. **Logs:** Always check Render logs when debugging backend issues

4. **Socket Retry:** The app now retries connections automatically - give it 20-30 seconds

5. **Debug Page:** Keep `/debug` in production to quickly diagnose issues (remove later if needed)

---

## ✅ Success Checklist

- [ ] Backend deployed on Render with correct env vars
- [ ] Frontend deployed on Vercel
- [ ] `/api/health` endpoint returns success
- [ ] `/debug` page shows green checkmarks
- [ ] Can see data loading on home page
- [ ] Socket.IO connected (check console)
- [ ] No CORS errors in browser console

---

Need help? Check:
- Render Logs: Dashboard → Your Service → Logs
- Browser Console: F12 → Console tab
- Debug Page: `your-app.vercel.app/debug`
