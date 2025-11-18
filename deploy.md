# Deployment Guide - Image Recommendation System

## Frontend Deployment (Vercel)

### Prerequisites
- Node.js 18+ and pnpm installed
- Vercel CLI installed: `npm i -g vercel`
- Vercel account (sign up at https://vercel.com)

### Step 1: Build Frontend
```bash
pnpm run build
```

### Step 2: Deploy Frontend
```bash
vercel --prod
```

### Frontend Environment Variables
Create a `.env.production` file:
```
VITE_API_URL=https://your-backend-url.vercel.app
```

## Backend Deployment (Vercel Serverless)

### Step 1: Prepare Backend
```bash
cd api
pip install -r requirements.txt
```

### Step 2: Create Vercel Configuration
The `vercel.json` file is already configured for serverless deployment.

### Step 3: Deploy Backend
```bash
vercel --prod
```

### Backend Environment Variables
Add these to your Vercel project settings:
```
PYTHON_VERSION=3.9
```

## Alternative Deployment Options

### Option 1: Netlify (Frontend Only)
1. Build: `pnpm run build`
2. Deploy dist folder to Netlify
3. Set environment variables in Netlify dashboard

### Option 2: Railway (Full Stack)
1. Sign up at https://railway.app
2. Connect your GitHub repository
3. Deploy both frontend and backend services

### Option 3: Heroku (Backend Only)
1. Create Heroku app
2. Add Python buildpack
3. Deploy api folder
4. Update frontend API_URL

## Production Checklist

✅ **Frontend**
- [ ] Environment variables configured
- [ ] API URL points to production backend
- [ ] Build completes successfully
- [ ] All routes work correctly

✅ **Backend**
- [ ] Python dependencies installed
- [ ] Environment variables set
- [ ] File upload size limits configured
- [ ] Error handling implemented

✅ **Database/Storage**
- [ ] Image storage configured (local or cloud)
- [ ] Feature vectors persisted
- [ ] Backup strategy implemented

## Testing Production Deployment

1. **Upload Test**: Upload an image and verify processing
2. **Recommendation Test**: Check if recommendations are generated
3. **Gallery Test**: Browse and search images
4. **Performance Test**: Test with multiple concurrent users

## Monitoring

- Set up application monitoring (Vercel Analytics, etc.)
- Configure error tracking (Sentry recommended)
- Monitor API response times and error rates

## Support

For deployment issues:
1. Check build logs for errors
2. Verify environment variables
3. Test API endpoints manually
4. Review application logs