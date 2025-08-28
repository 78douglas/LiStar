# 🚀 Deployment Guide - Gamified Couples Task App

This guide provides multiple deployment options for your gamified couples task management application.

## 📋 Prerequisites

- Node.js 18+ installed
- Git (for some deployment methods)
- A hosting account (Vercel, Netlify, etc.)

## 🏗️ Build Process

The application is built using Vite and generates static files that can be served from any web server.

```bash
npm install
npm run build
```

The built files will be in the `dist` directory.

## 🌐 Deployment Options

### 1. Vercel (Recommended) ⭐

**Easiest for React apps with zero configuration**

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Your app will be deployed with a `.vercel.app` URL

**Or use Vercel Dashboard:**
1. Visit [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will auto-detect the Vite configuration

### 2. Netlify

**Great for drag-and-drop deployment**

1. Build the project: `npm run build`
2. Visit [netlify.com](https://netlify.com)
3. Drag the `dist` folder to the deploy area

**Or connect to Git:**
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### 3. GitHub Pages

**Free hosting with GitHub**

1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Enable GitHub Actions deployment
4. The workflow file is already included (`.github/workflows/deploy.yml`)

### 4. Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Choose 'dist' as public directory
# Configure as single-page app: Yes
# Don't overwrite index.html
firebase deploy
```

### 5. Docker Deployment

**For containerized deployments**

```bash
# Build the Docker image
docker build -t couples-app .

# Run the container
docker run -p 3000:80 couples-app
```

Access at `http://localhost:3000`

### 6. Manual Server Deployment

1. Build the project: `npm run build`
2. Upload the `dist` folder contents to your web server
3. Configure your server to serve `index.html` for all routes (SPA configuration)

#### Apache Configuration (.htaccess):
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

#### Nginx Configuration:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## 📱 Features Included

- ✅ Responsive design (mobile-friendly)
- ✅ Dark/Light theme toggle
- ✅ Brazilian Portuguese interface
- ✅ Local storage data persistence
- ✅ PWA-ready (can be enhanced for offline use)

## 🔧 Environment Variables

This app uses local storage and doesn't require backend services or environment variables in the current version.

For future database integration, you can add:
- `VITE_API_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_KEY`

## 🌟 Post-Deployment Checklist

- [ ] Test login with both accounts (`husband`/`wife` - password: `123`)
- [ ] Verify task creation and assignment
- [ ] Test task completion and rating flow
- [ ] Check reward creation and redemption
- [ ] Verify theme toggle functionality
- [ ] Test on mobile devices
- [ ] Check all Brazilian Portuguese text displays correctly

## 🚨 Troubleshooting

### Build Errors
- Ensure Node.js 18+ is installed
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript errors with `npm run build`

### Routing Issues
- Ensure your hosting provider supports SPA routing
- Configure redirects to serve `index.html` for all routes

### Performance Issues
- The app uses local storage - no backend required
- Static assets are optimized during build
- Consider enabling gzip compression on your server

## 🔄 Updates

To update the deployed app:
1. Make changes to your code
2. Run the build process again
3. Deploy using your chosen method
4. Clear browser cache if needed

## 📞 Support

For deployment issues:
- Check the hosting provider's documentation
- Verify the `dist` folder contains all necessary files
- Ensure proper routing configuration for SPA

---

**Happy Deploying! 🎉**