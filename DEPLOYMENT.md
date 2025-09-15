# Deployment Guide

This guide covers multiple deployment options for the Citation Formatter Frontend.

## 🚀 Quick Deploy Options

### 1. Vercel (Recommended)

Vercel is the easiest and most popular option for React applications.

#### Automatic Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push to main

#### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Environment Variables
Set these in your Vercel dashboard:
- `REACT_APP_API_URL`: Your backend API URL
- `REACT_APP_ENV`: `production`

### 2. Netlify

#### Automatic Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Set environment variables in Netlify dashboard

#### Manual Deployment
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=build
```

### 3. Docker Deployment

#### Local Docker
```bash
# Build image
docker build -t citation-formatter-frontend .

# Run container
docker run -p 3000:80 citation-formatter-frontend
```

#### Docker Compose
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down
```

#### Production Docker
```bash
# Build for production
docker build -t citation-formatter-frontend:latest .

# Run with environment variables
docker run -p 80:80 \
  -e REACT_APP_API_URL=https://your-backend.com \
  citation-formatter-frontend:latest
```

## 🔧 Environment Configuration

### Backend Deployment (Render)

Before deploying the frontend, you need to deploy the backend to Render:

1. **Deploy Backend to Render**
   - Follow the guide in `../citation-formatter-backend/RENDER_DEPLOYMENT.md`
   - Get your Render backend URL (e.g., `https://your-backend-name.onrender.com`)

2. **Update CORS Settings**
   - In your Render backend dashboard, set `CORS_ORIGIN` to your frontend domain
   - This allows your frontend to communicate with the backend

### Required Variables
- `REACT_APP_API_URL`: Backend API URL (required)
  - For Render backend: `https://your-backend-name.onrender.com`
  - For local development: `http://localhost:3000`

### Optional Variables
- `REACT_APP_ENV`: Environment (development/production)
- `REACT_APP_ENABLE_DARK_MODE`: Enable dark mode (true/false)
- `REACT_APP_ENABLE_ANALYTICS`: Enable analytics (true/false)
- `REACT_APP_GA_TRACKING_ID`: Google Analytics tracking ID
- `REACT_APP_SENTRY_DSN`: Sentry error tracking DSN

### Setting Environment Variables

#### Vercel
1. Go to your project dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable with appropriate values

#### Netlify
1. Go to your site dashboard
2. Navigate to Site settings > Environment variables
3. Add each variable with appropriate values

#### Docker
```bash
# Using environment file
docker run --env-file .env.production citation-formatter-frontend

# Using individual variables
docker run -e REACT_APP_API_URL=https://api.example.com citation-formatter-frontend
```

## 🔄 Automated Deployment

### GitHub Actions

The repository includes GitHub Actions workflows for:
- **Vercel Deployment**: `.github/workflows/deploy-vercel.yml`
- **Netlify Deployment**: `.github/workflows/deploy-netlify.yml`
- **Docker Build**: `.github/workflows/docker-build.yml`

#### Required Secrets

For Vercel:
- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID
- `REACT_APP_API_URL`: Your backend API URL

For Netlify:
- `NETLIFY_AUTH_TOKEN`: Your Netlify API token
- `NETLIFY_SITE_ID`: Your Netlify site ID
- `REACT_APP_API_URL`: Your backend API URL

### Setting up Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add each required secret

## 🌐 Custom Domain Setup

### Vercel
1. Go to your project dashboard
2. Navigate to Settings > Domains
3. Add your custom domain
4. Configure DNS records as instructed

### Netlify
1. Go to your site dashboard
2. Navigate to Domain management
3. Add your custom domain
4. Configure DNS records as instructed

## 🔒 Security Considerations

### HTTPS
- All deployment platforms provide HTTPS by default
- Ensure your backend API also uses HTTPS

### Environment Variables
- Never commit sensitive data to version control
- Use platform-specific secret management
- Rotate API keys regularly

### Headers
- Security headers are configured in `nginx.conf` and `netlify.toml`
- CORS is handled by the backend API

## 📊 Monitoring and Analytics

### Performance Monitoring
- Vercel provides built-in analytics
- Netlify provides web vitals monitoring
- Consider adding Sentry for error tracking

### Analytics
- Google Analytics can be enabled via `REACT_APP_GA_TRACKING_ID`
- Set `REACT_APP_ENABLE_ANALYTICS=true` to enable

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
- Check Node.js version (requires 18+)
- Verify all dependencies are installed
- Check for TypeScript errors

#### Environment Variables Not Working
- Ensure variables start with `REACT_APP_`
- Check variable names match exactly
- Verify variables are set in the correct environment

#### API Connection Issues
- Verify `REACT_APP_API_URL` is correct
- Check CORS configuration on backend
- Ensure backend is accessible from frontend domain

#### Docker Issues
- Check Dockerfile syntax
- Verify nginx configuration
- Check container logs: `docker logs <container-id>`

### Getting Help

1. Check the application logs
2. Verify environment variables
3. Test API connectivity
4. Check browser console for errors
5. Review deployment platform logs

## 📝 Deployment Checklist

Before deploying:

- [ ] Backend API is deployed and accessible
- [ ] Environment variables are configured
- [ ] Tests are passing
- [ ] Build completes successfully
- [ ] Custom domain is configured (if applicable)
- [ ] SSL certificate is valid
- [ ] Analytics are configured (if desired)
- [ ] Error tracking is set up (if desired)

## 🔄 Rollback Strategy

### Vercel
- Use Vercel dashboard to rollback to previous deployment
- Or use CLI: `vercel rollback <deployment-url>`

### Netlify
- Use Netlify dashboard to rollback to previous deployment
- Or use CLI: `netlify rollback`

### Docker
- Keep previous image tags
- Use `docker run` with previous image tag

## 📈 Scaling Considerations

### Performance
- Enable CDN (automatic with Vercel/Netlify)
- Optimize images and assets
- Use lazy loading for components
- Implement caching strategies

### Cost Optimization
- Monitor usage and costs
- Use appropriate deployment tier
- Optimize bundle size
- Consider serverless vs. container deployment
