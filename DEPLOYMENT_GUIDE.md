# Deployment Guide for Vercel

## 🚀 How to Deploy

### Step 1: Prepare for GitHub

1. Make sure all changes are committed
2. The `.gitignore` file will automatically exclude `config.js` (your API key stays private)
3. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your repository
5. **IMPORTANT**: Before deploying, add Environment Variables:
   - Click "Environment Variables"
   - Add these variables:
     - `YOUTUBE_API_KEY` = `AIzaSyDIk63p5A5uVapllscALawpftloThhaOns`
     - `YOUTUBE_CHANNEL_ID` = `UCkRMsLYwmLiXjeUYSJ9GXFQ`
6. Click "Deploy"

### Step 3: How It Works

**Local Development:**
- Uses `config.js` with your API key (not in Git)
- Direct API calls to YouTube
- Contact form uses Formspree endpoint from config

**Production (Vercel):**
- API key stored securely in Vercel Environment Variables
- Uses serverless function `/api/youtube` to proxy requests
- API key NEVER exposed to the browser
- Contact form uses embedded Formspree endpoint (Formspree endpoints are designed to be public)
- No `config.js` needed in production

## 🔒 Security Features

### Image Protection
✅ Right-click disabled on images
✅ Drag-and-drop disabled
✅ User selection disabled
✅ Context menu blocked

**Note:** While these protections make it harder to download images, determined users can still access them through browser dev tools. For absolute protection, consider:
- Adding visible watermarks
- Using lower resolution images
- Implementing a backend image proxy

### API Key Security
✅ API key not in GitHub
✅ API key stored in Vercel environment variables
✅ Serverless function proxies all requests
✅ No client-side exposure

### Assets Folder
⚠️ **Important:** The `assets/` folder MUST be publicly accessible for the website to display images. This is how static websites work - if images are shown in the browser, they can be accessed.

However, the image protection features make it difficult for casual users to download them.

## 🔄 Updating Your Site

After deployment, any changes you push to GitHub will automatically trigger a new deployment on Vercel.

## 📝 Testing

- **Local**: Open `index.html` or use `python3 -m http.server 8000`
- **Production**: Your Vercel URL (e.g., `yoursite.vercel.app`)

The code automatically detects whether it's running locally or in production and uses the appropriate method to fetch YouTube videos.

