# Citation Formatter Frontend

A modern React application for formatting academic references in multiple citation styles with an intuitive user interface.

## 🚀 Features

- **8 Citation Styles**: APA, MLA, Chicago, Harvard, Vancouver, IEEE, AMA, ASA
- **Smart Reference Lookup**: DOI and title-based searches
- **Real-time Formatting**: Instant style switching
- **Download Support**: BibTeX and EndNote export
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme switching
- **Citation History**: Local storage of recent citations
- **Bulk Operations**: Multiple reference processing
- **Error Handling**: User-friendly error messages
- **Performance Optimized**: Lazy loading and caching

## 🏗️ Architecture

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Forms**: React Hook Form
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Testing**: Jest, React Testing Library, Cypress
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18 or higher
- npm 8 or higher

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/citation-formatter-frontend.git
cd citation-formatter-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Start development server
```bash
npm start
```

## 🧪 Testing

### Run unit tests
```bash
npm test
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run E2E tests
```bash
npm run test:e2e
```

### Open E2E test runner
```bash
npm run test:e2e:open
```

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run test:coverage` - Run tests with coverage
- `npm run test:e2e` - Run E2E tests
- `npm run test:e2e:open` - Open E2E test runner
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm run analyze` - Analyze bundle size

## 🎨 UI Components

### Core Components
- **ReferenceInput**: Input form for references
- **CitationDisplay**: Display formatted citations
- **StyleSelector**: Citation style dropdown
- **DownloadButtons**: Export functionality
- **ErrorBoundary**: Error handling
- **LoadingSpinner**: Loading states

### Layout Components
- **Header**: Navigation and branding
- **Footer**: Links and information
- **Sidebar**: Additional options
- **Modal**: Overlay dialogs

## 🎯 Features

### Citation Formatting
- **Multiple Styles**: Support for 8 academic citation styles
- **Real-time Preview**: See changes instantly
- **Bulk Processing**: Handle multiple references
- **Validation**: Check reference validity

### User Experience
- **Responsive Design**: Works on all devices
- **Dark Mode**: Theme switching
- **Keyboard Shortcuts**: Power user features
- **Accessibility**: WCAG 2.1 compliant

### Data Management
- **Local Storage**: Save recent citations
- **Export Options**: Multiple download formats
- **Import Support**: Bulk reference import
- **History**: Track formatting history

## 🚀 Deployment

### Quick Deploy

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=build
```

#### Docker
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t citation-formatter-frontend .
docker run -p 3000:80 citation-formatter-frontend
```

### Automated Deployment

This repository includes GitHub Actions workflows for automated deployment to:
- **Vercel**: Automatic deployment on push to main
- **Netlify**: Automatic deployment on push to main  
- **Docker**: Build and push to GitHub Container Registry

### Environment Variables

Set these environment variables for production:

**Required:**
- `REACT_APP_API_URL`: Your backend API URL
  - For Render backend: `https://your-backend-name.onrender.com`
  - For local development: `http://localhost:3000`

**Optional:**
- `REACT_APP_ENV`: `production`
- `REACT_APP_ENABLE_DARK_MODE`: `true`
- `REACT_APP_ENABLE_ANALYTICS`: `false`

### Detailed Deployment Guide

For comprehensive deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🔒 Security

- **Content Security Policy**: XSS protection
- **Input Validation**: Sanitize user input
- **HTTPS Only**: Secure connections
- **Environment Variables**: Secure configuration

## 📊 Performance

- **Code Splitting**: Lazy load components
- **Image Optimization**: Optimized assets
- **Caching**: Browser and CDN caching
- **Bundle Analysis**: Monitor bundle size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Related Projects

- **Backend**: [citation-formatter-backend](https://github.com/yourusername/citation-formatter-backend)
- **Documentation**: [Full Documentation](https://github.com/yourusername/citation-formatter)

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

## 🎉 Acknowledgments

Built with React, Tailwind CSS, and modern web technologies for the best user experience.