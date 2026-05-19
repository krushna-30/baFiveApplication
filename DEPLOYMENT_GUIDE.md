# baFive Complete Deployment Guide

## Overview

baFive is a full-stack workplace networking application with:
- **Frontend**: React + TypeScript + Vite (localhost:5173)
- **Backend**: Express.js + SQLite (port 5000)
- **Theme System**: 9 customizable color themes
- **Authentication**: JWT-based with bcrypt password hashing

---

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Production Checklist](#production-checklist)
5. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Prerequisites
- **Node.js** v16+ (Download from nodejs.org)
- **npm** or **yarn** (comes with Node.js)
- **Git** for version control
- **SQLite3** (bundled with sqlite3 npm package)

### Frontend Setup

```bash
# Navigate to frontend root
cd c:\baFive

# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Backend Setup

```bash
# Navigate to backend directory
cd c:\baFive\backend

# Install dependencies
npm install

# Initialize database with schema
node execute-schema.js

# Start development server (runs on http://localhost:5000)
npm run dev

# Start production server
npm start
```

### Environment Variables

**Frontend** (`c:\baFive\.env`):
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=baFive
```

**Backend** (`c:\baFive\backend\.env`):
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
DATABASE_PATH=./data/bafive.db
CORS_ORIGIN=http://localhost:5173
```

---

## Backend Deployment

### Option 1: Deploy to Heroku (Recommended for Testing)

```bash
# 1. Install Heroku CLI
# Visit: https://devcenter.heroku.com/articles/heroku-cli

# 2. Login to Heroku
heroku login

# 3. Create new Heroku app
heroku create bafive-backend

# 4. Set environment variables
heroku config:set JWT_SECRET=your_production_secret_key_here
heroku config:set NODE_ENV=production
heroku config:set DATABASE_PATH=/tmp/bafive.db

# 5. Deploy backend
git push heroku main

# 6. View logs
heroku logs --tail

# 7. Test backend
curl https://bafive-backend.herokuapp.com/health
```

### Option 2: Deploy to AWS EC2

```bash
# 1. Create EC2 instance (t2.micro eligible for free tier)
# - Ubuntu 22.04 LTS
# - Open ports: 80, 443, 5000

# 2. SSH into instance
ssh -i your-key.pem ec2-user@your-instance-ip

# 3. Install Node.js
sudo apt-get update
sudo apt-get install nodejs npm
sudo apt-get install sqlite3

# 4. Clone repository
git clone https://github.com/tejash-veer46/baFiveApplication.git
cd baFiveApplication/backend

# 5. Install dependencies and setup
npm install
node execute-schema.js

# 6. Start server (use PM2 for process management)
npm install -g pm2
pm2 start server.js --name "bafive-backend"
pm2 save
pm2 startup

# 7. Configure Nginx reverse proxy
sudo apt-get install nginx
# Edit /etc/nginx/sites-available/default to proxy to port 5000

# 8. Get SSL certificate (Let's Encrypt)
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

### Option 3: Deploy to Railway.app (Simplest)

```bash
# 1. Create account at railway.app
# 2. Connect GitHub repository
# 3. Create new service → GitHub
# 4. Select: tejash-veer46/baFiveApplication
# 5. Set root directory: ./backend
# 6. Add environment variables:
#    - PORT=5000
#    - JWT_SECRET=production_secret
#    - NODE_ENV=production
# 7. Deploy → Auto-deployed on git push
```

### Database Backup & Migration

```bash
# Backup current SQLite database
cp ./data/bafive.db ./backups/bafive-$(date +%Y%m%d).db

# Initialize fresh database on new server
node execute-schema.js

# Restore from backup
cp ./backups/bafive-backup.db ./data/bafive.db
```

---

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy frontend
vercel --prod

# 4. Set environment variables in Vercel dashboard
# VITE_API_URL=https://your-backend-url.com

# 5. Auto-deploy on git push (connect GitHub)
```

### Option 2: Deploy to Netlify

```bash
# 1. Create account at netlify.com
# 2. Connect GitHub repository
# 3. Build settings:
#    - Build command: npm run build
#    - Publish directory: dist
# 4. Deploy site
# 5. Set environment variables: VITE_API_URL
```

### Option 3: Deploy to Firebase Hosting

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Initialize Firebase
firebase init hosting

# 4. Build frontend
npm run build

# 5. Deploy
firebase deploy --only hosting

# 6. Set environment variables in Firebase console
```

### Update API URLs for Production

**Update `src/services/api.ts`**:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Change from:
// http://localhost:5000
// To:
// https://your-backend-url.com (for production)
```

---

## Production Checklist

### Security
- [ ] Change JWT_SECRET to a strong random value
- [ ] Enable HTTPS/SSL on both frontend and backend
- [ ] Set NODE_ENV=production
- [ ] Configure CORS properly (limit origins)
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting on API routes
- [ ] Implement CSRF protection
- [ ] Hash passwords with bcrypt (already implemented)

### Performance
- [ ] Enable gzip compression on backend
- [ ] Set up CDN for frontend assets (Vercel/Netlify do this automatically)
- [ ] Implement database connection pooling
- [ ] Add caching headers for static assets
- [ ] Minify and bundle frontend code (done by build process)
- [ ] Set up monitoring and error tracking (Sentry, LogRocket)

### Monitoring & Logging
- [ ] Set up application error monitoring (Sentry)
- [ ] Configure logging (Morgan, Winston)
- [ ] Set up uptime monitoring (StatusPage, Pingdom)
- [ ] Monitor database performance
- [ ] Track API response times
- [ ] Set up alerts for errors/failures

### Database
- [ ] Set up automated daily backups
- [ ] Test backup restoration process
- [ ] Monitor database size and growth
- [ ] Implement query optimization
- [ ] Archive old messages/data

### Testing
- [ ] Run integration tests against production endpoints
- [ ] Load testing (stress test with 1000+ concurrent users)
- [ ] Security penetration testing
- [ ] Test error scenarios
- [ ] Verify email notifications work

---

## Monitoring & Maintenance

### Server Health Check
```bash
# Check backend status
curl https://your-backend-url/health

# Expected response:
# {"status":"OK","message":"baFive Backend is running"}
```

### View Server Logs
```bash
# Heroku
heroku logs --tail

# EC2 with PM2
pm2 logs bafive-backend

# Docker
docker logs bafive-backend
```

### Database Maintenance
```bash
# Check database size
ls -lh ./data/bafive.db

# Vacuum database (optimize and reduce size)
sqlite3 ./data/bafive.db "VACUUM;"

# Check table sizes
sqlite3 ./data/bafive.db "SELECT name, page_count * page_size as size FROM pragma_page_count(), pragma_page_size(), sqlite_master WHERE type='table';"
```

---

## Troubleshooting

### Backend won't start
```bash
# Check port is not in use
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process using port 5000
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Check Node.js version
node --version  # Should be v16 or higher

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Frontend won't connect to backend
```bash
# Check backend is running
curl http://localhost:5000/health

# Verify CORS is enabled in backend/src/server.js
# Should include: origin: 'http://localhost:5173'

# Check API_URL in frontend
# Look at Network tab in Chrome DevTools (F12)
# API requests should go to http://localhost:5000
```

### Database errors
```bash
# Reinitialize database
rm ./data/bafive.db
node execute-schema.js

# Check database integrity
sqlite3 ./data/bafive.db "PRAGMA integrity_check;"

# Restore from backup
cp ./backups/bafive-backup.db ./data/bafive.db
```

### JWT authentication issues
```bash
# Verify token in browser
# Open DevTools → Application → localStorage → auth_token

# Token should be a valid JWT
# Decode at: https://jwt.io/

# If invalid, clear localStorage and login again
```

### Memory/CPU high on server
```bash
# Check process memory usage
pm2 monit

# Enable clustering (use multiple cores)
# In server.js, add clustering module
npm install cluster

# Restart process
pm2 restart bafive-backend
```

---

## Performance Benchmarks (Target)

- **Frontend Load Time**: < 2 seconds
- **API Response Time**: < 200ms (95th percentile)
- **Database Query Time**: < 50ms
- **Concurrent Users**: 10,000+
- **Uptime**: 99.9%

---

## Scaling Strategy

### Phase 1 (Current - 0-1,000 users)
- Single backend server on Heroku/Railway
- SQLite database (good for prototyping)
- Vercel/Netlify for frontend
- In-memory session storage

### Phase 2 (1,000-10,000 users)
- Add Redis cache layer
- Migrate to PostgreSQL database
- Implement WebSockets for real-time messaging
- Add load balancer
- Separate auth server

### Phase 3 (10,000+ users)
- Multi-region deployment
- Database replication
- Implement microservices
- Add message queue (RabbitMQ/Kafka)
- CDN with edge caching
- Separate API gateway

---

## Support & Resources

- **Documentation**: See README.md in each folder
- **API Reference**: backend/API.md
- **Testing Guide**: backend/TESTING.md
- **Database Schema**: backend/DATABASE.md
- **Authentication**: backend/AUTHENTICATION.md

---

## Deployment Checklist Template

```
BACKEND:
☐ Code reviewed and tested locally
☐ All environment variables set
☐ Database backups configured
☐ CORS origins configured correctly
☐ JWT_SECRET changed to production value
☐ SSL/HTTPS enabled
☐ Error logging configured
☐ Rate limiting enabled
☐ Uptime monitoring enabled

FRONTEND:
☐ API_URL points to correct backend
☐ Build passes without errors
☐ Theme system working in production build
☐ Error messages display correctly
☐ All buttons functional
☐ Forms validate correctly
☐ No console errors
☐ Mobile responsive verified
☐ SEO tags configured
☐ Analytics configured

TESTING:
☐ Authentication flow works end-to-end
☐ Profile discovery works
☐ Matching system works
☐ Messaging system works
☐ Error handling verified
☐ Performance load testing passed
☐ Security audit passed
☐ Database backups tested and working
```

---

**Last Updated**: May 19, 2026  
**Version**: 1.0.0  
**Status**: Ready for Production Deployment
