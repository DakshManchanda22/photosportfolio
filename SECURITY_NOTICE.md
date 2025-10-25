# ⚠️ IMPORTANT SECURITY NOTICE

## Your API Key Has Been Exposed

Your YouTube API key was shared in a public conversation. For security, you should:

### 1. Regenerate Your API Key (Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Find your current API key: `AIzaSyDdCaK-QC-osjbVap7VdUX3ZzrdTO2S_hk`
4. Click the three dots menu → "Delete"
5. Create a new API key
6. Update `config.js` with your new key

### 2. Restrict Your New API Key

To prevent misuse:
1. In Google Cloud Console, click on your new API key
2. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add: `yourdomain.com/*` (replace with your actual domain)
   - Add: `localhost/*` (for local testing)
3. Under "API restrictions":
   - Select "Restrict key"
   - Choose only "YouTube Data API v3"
4. Save

### 3. Keep Your API Key Private

✅ **Your API key is now secure:**
- Stored in `config.js` (not in the main code)
- `config.js` is in `.gitignore` (won't be uploaded to GitHub)
- Only you have access to it

❌ **Never:**
- Share your API key publicly
- Commit `config.js` to GitHub
- Share screenshots containing the key

### 4. If You Deploy to GitHub

Before pushing to GitHub:
1. Make sure `config.js` is in `.gitignore` ✓
2. Use `config.example.js` as a template for others
3. Add a note in your README about copying the example file

Your website is now working with the API key securely stored! 🔒

