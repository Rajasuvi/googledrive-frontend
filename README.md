# Google Drive Clone - Frontend

A modern, responsive React frontend for a Google Drive-like cloud storage application with beautiful UI and seamless file management.

## 🚀 Features

- **Modern Authentication UI**
  - Beautiful gradient-based design
  - Login/Register forms
  - Email verification
  - Password reset flow

- **File Management Dashboard**
  - Drag and drop file upload
  - Grid and list view modes
  - Search functionality
  - Download files
  - Delete files and folders

- **Folder Management**
  - Create folders
  - Navigate into folders
  - Delete folders with contents

- **User Experience**
  - Toast notifications
  - Loading states
  - Responsive design
  - Glass-morphism effects
  - Smooth animations

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn
- Backend API running

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/googledrive-frontend.git
   cd googledrive-frontend
   ```

2. **Install dependencies**
   ```bash
  npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Open http://localhost:5173 in your browser

## 🎨 Tech Stack

- **React 18** - UI framework
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Dropzone** - File uploads
- **Lucide React** - Icons
- **Vite** - Build tool

## 📁 Project Structure

```
googledrive-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── VerifyEmail.jsx
│   │   └── Dashboard/
│   │       └── Dashboard.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   └── file.service.js
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎯 Key Features

### Authentication Flow

1. **Registration**
   - User fills registration form
   - Email verification link sent
   - Account activated upon verification

2. **Login**
   - Email and password authentication
   - JWT token stored in localStorage
   - Redirects to dashboard

3. **Password Reset**
   - Request reset link via email
   - Set new password
   - Confirmation email sent

### Dashboard Features

1. **File Upload**
   - Drag and drop interface
   - Multiple file selection
   - Progress indication
   - Upload to specific folders

2. **File Management**
   - Grid and list views
   - Search files
   - Download files
   - Delete files

3. **Folder Management**
   - Create new folders
   - Navigate folder structure
   - Delete folders with contents

## 🚀 Build & Deploy

### Build for Production

```bash
npm run build
```

Builds the app to `dist/` folder.

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com
   - Import your repository
   - Add environment variable: `VITE_API_URL`
   - Deploy

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Drag and drop `dist/` to Netlify
   - Or connect GitHub repository
   - Add environment variable

## 🎨 UI/UX Design

### Design Philosophy
- **Modern & Clean**: Glass-morphism and gradient effects
- **Responsive**: Mobile-first approach
- **Intuitive**: Clear navigation and actions
- **Professional**: Enterprise-grade UI

### Color Scheme
- Primary: Purple gradients (#667eea to #764ba2)
- Accent: Pink and blue variations
- Background: Gradient overlays with blur
- Text: White on colored backgrounds, dark on light

### Typography
- Primary: Inter (body text)
- Display: Geist (headings)
- Sizes: Responsive with Tailwind classes

## 🔐 Security

- JWT tokens stored in localStorage
- Automatic token refresh
- Protected routes
- XSS protection
- CSRF protection via SameSite cookies

## 📱 Responsive Design

- **Mobile**: Optimized touch interactions
- **Tablet**: Adjusted grid layouts
- **Desktop**: Full feature set with hover states

## 🐛 Troubleshooting

### API Connection Issues
```bash
# Check if backend is running
curl http://localhost:5000/health

# Verify VITE_API_URL in .env
cat .env
```

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Ensure backend CORS is configured
- Check FRONTEND_URL in backend .env
- Verify API URL is correct

## 📊 Performance

- Lazy loading of routes
- Image optimization
- Code splitting
- Minimal bundle size
- Fast page loads

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Build and preview
npm run build
npm run preview
```

## 🤝 Contributing

This is an assessment project. Fork for your own learning.

## 📄 License

This project is for assessment purposes only.

---

**Built with ❤️ using React, Tailwind CSS, and Vite**
