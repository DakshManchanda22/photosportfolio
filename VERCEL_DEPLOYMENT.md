# Complete Vercel Deployment Guide

This guide walks you through deploying your photography portfolio to Vercel with secure Cloudinary image hosting and YouTube integration.

## 📋 Prerequisites

1. **GitHub Account** - Your code will be stored here
2. **Vercel Account** - Free account at [vercel.com](https://vercel.com)
3. **Cloudinary Account** - Free account at [cloudinary.com](https://cloudinary.com)
4. **Google Cloud Console** - For YouTube API key (if using YouTube videos)

---

## 🚀 Step 1: Prepare Your Code

### 1.1 Install Dependencies

```bash
npm install
```

This installs the `cloudinary` package required for the serverless function.

### 1.2 Verify Image Paths

Check `index.html` and ensure all `data-path` attributes match your Cloudinary folder structure:

- Gallery images: `data-path="grid/DSC01915.jpg"` (adjust if your folder structure differs)
- Hero background: `data-path="IMG_8677.jpg"` (adjust if needed)

**To find your Cloudinary paths:**
1. Go to Cloudinary Dashboard → Media Library
2. Navigate to your uploaded folder
3. Check the exact path shown (e.g., `portfolio/grid/DSC01915.jpg`)
4. Update `data-path` values in `index.html` to match

### 1.3 Commit to GitHub

```bash
git init
git add .
git commit -m "Initial commit with Cloudinary integration"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

---

## 🔐 Step 2: Get Your API Keys

### 2.1 Cloudinary Credentials

1. Go to [Cloudinary Dashboard](https://console.cloudinary.com/)
2. Navigate to **Settings** → **Security** (or click your account name → Settings)
3. Copy these values:
   - **Cloud Name** (e.g., `daksh-photos`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

**⚠️ Important:** Keep your API Secret secure - never share it publicly!

### 2.2 YouTube API Key (Optional - for video section)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **YouTube Data API v3**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key
6. (Recommended) Restrict the key to YouTube Data API v3 only

### 2.3 YouTube Channel ID

1. Go to your YouTube channel
2. The Channel ID is in the URL: `youtube.com/channel/UCkRMsLYwmLiXjeUYSJ9GXFQ`
   - Or find it in YouTube Studio → Settings → Channel → Advanced settings

---

## 🚀 Step 3: Deploy to Vercel

### 3.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Import your repository
5. Click **"Import"**

### 3.2 Configure Environment Variables

**Before clicking Deploy**, add all environment variables:

1. Click **"Environment Variables"** (or go to Settings → Environment Variables)
2. Add each variable one by one:

#### Required: Cloudinary Variables

| Variable Name | Value | Where to Find |
|--------------|-------|---------------|
| `CLOUDINARY_CLOUD_NAME` | Your cloud name | Cloudinary Dashboard → Settings |
| `CLOUDINARY_API_KEY` | Your API key | Cloudinary Dashboard → Settings |
| `CLOUDINARY_API_SECRET` | Your API secret | Cloudinary Dashboard → Settings |

#### Optional: YouTube Variables (if using video section)

| Variable Name | Value | Where to Find |
|--------------|-------|---------------|
| `YOUTUBE_API_KEY` | Your API key | Google Cloud Console |
| `YOUTUBE_CHANNEL_ID` | Your channel ID | YouTube channel URL or Studio |

3. For each variable:
   - Enter the **Variable Name** exactly as shown (case-sensitive)
   - Enter the **Value**
   - Select **Production**, **Preview**, and **Development** (or just Production)
   - Click **"Save"**

### 3.3 Deploy

1. After adding all environment variables, go back to the deployment page
2. Click **"Deploy"**
3. Wait for deployment to complete (usually 1-2 minutes)

---

## ✅ Step 4: Verify Deployment

### 4.1 Check Deployment Status

1. In Vercel dashboard, check that deployment shows **"Ready"**
2. Click on your deployment to see the live URL

### 4.2 Test Your Site

1. **Open your live site** (e.g., `yoursite.vercel.app`)
2. **Check browser console** (F12) for any errors
3. **Verify images load:**
   - Gallery images should appear with skeleton loaders
   - Images should load from `res.cloudinary.com` (check Network tab)
   - Hero background should load
4. **Test lightbox:**
   - Click any gallery image
   - Verify full-quality image loads
   - Test navigation (prev/next)
5. **Test YouTube videos** (if enabled):
   - Scroll to "Latest Vids" section
   - Verify videos load

### 4.3 Check Serverless Functions

1. In Vercel dashboard, go to **Functions** tab
2. Verify `/api/cloudinary-url` function exists
3. Check function logs for any errors:
   - Go to **Deployments** → Click your deployment → **Functions** tab
   - Look for any red error messages

---

## 🐛 Troubleshooting

### Images Not Loading

**Problem:** Images show skeleton loader but never load

**Solutions:**
1. **Check Environment Variables:**
   - Go to Vercel → Settings → Environment Variables
   - Verify all 3 Cloudinary variables are set
   - Ensure variable names match exactly (case-sensitive)

2. **Check Image Paths:**
   - Open browser console (F12)
   - Look for 404 errors in Network tab
   - Verify `data-path` in HTML matches Cloudinary folder structure
   - Update paths in `index.html` if needed

3. **Check Cloudinary Settings:**
   - Go to Cloudinary Dashboard → Media Library
   - Verify images are uploaded
   - Check that images are set to "Authenticated" or "Restricted" access type
   - If public, change to "Authenticated" for security

4. **Check Function Logs:**
   - Vercel Dashboard → Your Project → Deployments → Click latest → Functions
   - Look for errors in `/api/cloudinary-url` logs

### "Cloudinary credentials not configured" Error

**Solution:**
- Verify all 3 environment variables are set in Vercel
- Redeploy after adding variables
- Check variable names match exactly:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

### Images Show 403 Forbidden

**Problem:** Images return 403 error

**Solutions:**
1. **Verify Cloudinary Access Type:**
   - Go to Cloudinary Dashboard → Media Library
   - Select an image → Settings
   - Ensure "Access mode" is set to "Authenticated" or "Restricted"

2. **Verify API Secret:**
   - Double-check `CLOUDINARY_API_SECRET` in Vercel matches Cloudinary dashboard
   - Ensure no extra spaces or characters

3. **Check Function Code:**
   - Verify `/api/cloudinary-url.js` has:
     - `type: 'authenticated'`
     - `sign_url: true`

### YouTube Videos Not Loading

**Problem:** "Latest Vids" section shows error

**Solutions:**
1. **Check Environment Variables:**
   - Verify `YOUTUBE_API_KEY` is set
   - Verify `YOUTUBE_CHANNEL_ID` is set

2. **Check API Key:**
   - Verify API key is valid in Google Cloud Console
   - Ensure YouTube Data API v3 is enabled
   - Check API key restrictions

3. **Check Function Logs:**
   - Look for errors in `/api/youtube` function logs

### Deployment Fails

**Problem:** Build fails during deployment

**Solutions:**
1. **Check package.json:**
   - Ensure `cloudinary` is in dependencies
   - Run `npm install` locally to verify

2. **Check Node Version:**
   - Vercel uses Node 18+ by default
   - If issues, specify in `package.json`:
     ```json
     "engines": {
       "node": ">=18.x"
     }
     ```

3. **Check Build Logs:**
   - Vercel Dashboard → Deployments → Click failed deployment
   - Review build logs for specific errors

---

## 🔄 Updating Your Site

After making changes:

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```

2. **Vercel automatically redeploys** - no manual action needed!

3. **Update environment variables** (if needed):
   - Vercel Dashboard → Settings → Environment Variables
   - Edit or add variables
   - Redeploy (or wait for next push)

---

## 📝 Local Development

### Setup

1. **Create `config.js`** (copy from `config.example.js`):
   ```javascript
   const CONFIG = {
       YOUTUBE_API_KEY: 'your-key-here',
       CHANNEL_ID: 'your-channel-id',
       FORMSPREE_ENDPOINT: 'your-endpoint'
   };
   ```

2. **For Cloudinary** (local testing):
   - Images will still fetch signed URLs from `/api/cloudinary-url`
   - Set environment variables locally or use Vercel CLI:
     ```bash
     vercel env pull .env.local
     ```

3. **Run locally:**
   ```bash
   # Using Vercel CLI (recommended)
   vercel dev
   
   # Or simple HTTP server
   python3 -m http.server 8000
   ```

---

## 🔒 Security Checklist

Before going live, verify:

- [ ] All API keys are in Vercel environment variables (not in code)
- [ ] `config.js` is in `.gitignore` (not committed)
- [ ] Cloudinary images are set to "Authenticated" access
- [ ] No API secrets visible in browser DevTools
- [ ] Images load from `res.cloudinary.com` (not local assets)
- [ ] Serverless functions return signed URLs only (no secrets)

---

## 📊 Performance Features

Your site includes:

- ✅ **Lazy Loading** - Images load only when visible (200px margin)
- ✅ **Skeleton Loaders** - Smooth loading experience
- ✅ **No Layout Shift** - All images have dimensions + aspect-ratio
- ✅ **CDN Delivery** - Images served from Cloudinary's global CDN
- ✅ **Auto Optimization** - Format, quality, and DPR automatically optimized
- ✅ **Signed URLs** - Secure, cacheable, CDN-backed

---

## 🎯 Quick Reference

### Environment Variables Summary

**Required:**
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

**Optional (for YouTube):**
- `YOUTUBE_API_KEY`
- `YOUTUBE_CHANNEL_ID`

### Important Files

- `/api/cloudinary-url.js` - Generates signed URLs (server-side only)
- `/api/youtube.js` - Fetches YouTube videos (server-side only)
- `/critical.js` - Main JavaScript (loads images via API)
- `/index.html` - All images use `data-path` attributes

### Key URLs

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Cloudinary Dashboard:** https://console.cloudinary.com/
- **Google Cloud Console:** https://console.cloud.google.com/

---

## 🆘 Need Help?

1. **Check Vercel Logs:** Dashboard → Deployments → Functions → View logs
2. **Check Browser Console:** F12 → Console tab for frontend errors
3. **Check Network Tab:** F12 → Network tab to see API calls
4. **Verify Environment Variables:** Settings → Environment Variables

---

**Your portfolio is now live with secure, fast, private image hosting! 🎉**

