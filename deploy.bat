@echo off
echo 🚀 Starting deployment process...

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install Node.js and npm first.
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Run build
echo 🔨 Building project...
npm run build

REM Check if build was successful
if not exist "dist" (
    echo ❌ Build failed. No dist directory found.
    pause
    exit /b 1
)

echo ✅ Build completed successfully!
echo 📁 Files are ready in the 'dist' directory
echo.
echo 🌐 Deployment options:
echo 1. Vercel: Run 'npx vercel' in project directory
echo 2. Netlify: Drag ^& drop 'dist' folder to https://app.netlify.com/drop
echo 3. GitHub Pages: Push to GitHub and enable Pages in repository settings
echo 4. Docker: Run 'docker build -t couples-app . ^&^& docker run -p 3000:80 couples-app'
echo.
echo 🎉 Ready to deploy!
pause