# Daksh's Diary - Photography Portfolio

A modern, responsive portfolio website with Pinterest-style masonry grid and automatic YouTube video integration.

## ✨ Features

- **Hero Section**: Elegant quote with fade-in animation
- **Pinterest-Style Grid**: Masonry layout that preserves image aspect ratios
- **Automatic YouTube Videos**: Fetches your latest videos using YouTube API
- **Lightbox Gallery**: Click any image to view full size with keyboard navigation
- **Smooth Animations**: Loading animations and hover effects throughout
- **Fully Responsive**: Looks great on desktop, tablet, and mobile
- **Social Links**: Instagram and YouTube icons in footer

## 🚀 Setup

### 1. API Key Setup (Required for videos)

The API key is already configured in `config.js`. Your videos will load automatically!

**Important**: If you plan to upload this to GitHub, the API key is protected by `.gitignore` and won't be exposed.

### 2. Adding Your Images

- Images are loaded from the `assets/` folder
- Currently displays 6 photos
- Add more images by updating `index.html` and adding more `.gallery-item` divs

### 3. Customization

- **Logo/Title**: Edit "Daksh's Diary" in `index.html`
- **Quote**: Change the Ansel Adams quote in the hero section
- **Colors**: Modify in `styles.css`
- **About Section**: Update your bio in the About section

## 📁 File Structure

```
Photosportfolio/
├── index.html              # Main HTML file
├── styles.css              # All styling
├── script.js               # JavaScript functionality
├── config.js               # API keys (private, in .gitignore)
├── config.example.js       # Template for API config
├── .gitignore              # Protects sensitive files
├── assets/                 # Your photos
│   ├── IMG_9047.jpg
│   ├── IMG_9102.jpg
│   └── ...
└── README.md               # This file
```

## 🌐 Browser Compatibility

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## 🔒 Security

### Image Protection
✅ Right-click disabled on images
✅ Drag-and-drop disabled  
✅ User selection disabled
✅ Context menu blocked

**Note:** These protections make downloading difficult for casual users. For maximum protection, the images could be watermarked.

### API Key Protection
✅ Your API key is stored in `config.js` (local only, in `.gitignore`)
✅ On Vercel: API key stored as environment variable
✅ Serverless function proxies all YouTube API requests
✅ API key never exposed to browser in production

## 💡 Tips

- Images automatically maintain their aspect ratios
- The YouTube section updates automatically when you post new videos
- Use high-quality images (1920px+ width recommended)
- Optimize image file sizes for faster loading

