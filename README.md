# 🕉️ ISKCON Event Management System

A beautiful, modern web application for managing ISKCON (International Society for Krishna Consciousness) events and spiritual gatherings. Built with React, TypeScript, and Tailwind CSS.

![ISKCON Events](https://images.pexels.com/photos/8828591/pexels-photo-8828591.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

### 🎯 Core Functionality
- **Event Management** - Browse, search, and filter spiritual events
- **User Registration** - Secure authentication system with role-based access
- **Event Registration** - Register for events and manage your participation
- **Admin Dashboard** - Comprehensive event management for administrators
- **Responsive Design** - Beautiful UI that works on all devices

### 🎨 Design Highlights
- **Spiritual Theming** - ISKCON-inspired colors (amber, orange, saffron)
- **Sacred Elements** - Om symbols, lotus patterns, and devotional quotes
- **Modern UX** - Clean, intuitive interface with smooth animations
- **Accessibility** - WCAG compliant with proper contrast ratios

### 🔐 Authentication & Authorization
- **Role-based Access** - User and Admin roles
- **Secure Login** - JWT-style token management
- **Protected Routes** - Private pages for authenticated users only
- **Demo Accounts** - Pre-configured accounts for testing

## 🚀 Live Demo

**🌐 Deployed Application:** [https://fabulous-smakager-bd0265.netlify.app](https://fabulous-smakager-bd0265.netlify.app)

### Demo Credentials

#### 👑 Admin Account
- **Email:** `admin@iskcon.org`
- **Password:** `admin123`
- **Access:** Full admin dashboard, event management

#### 👤 User Account
- **Email:** `krishna@devotee.com`
- **Password:** `krishna123`
- **Access:** Event browsing and registration

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Date-fns** - Date manipulation and formatting
- **React Hot Toast** - Beautiful notifications
- **Lucide React** - Modern icon library

### Development Tools
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd iskcon-event-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📱 Application Structure

### Pages & Routes

```
/                    # Home - Event listings
/login              # User authentication
/register           # New user registration
/events/:id         # Event details page
/my-registrations   # User's registered events
/admin              # Admin dashboard (admin only)
```

### Key Components

```
src/
├── components/
│   ├── Layout/          # Header, Footer, Layout
│   ├── auth/            # Authentication guards
│   ├── events/          # Event cards, forms, filters
│   └── common/          # Reusable UI components
├── contexts/            # React Context providers
├── pages/               # Page components
├── types/               # TypeScript definitions
└── utils/               # Utility functions
```

## 🎭 User Roles & Permissions

### 👤 Regular Users
- Browse all events
- Search and filter events
- Register for events
- Cancel registrations
- View personal registration history

### 👑 Administrators
- All user permissions
- Create new events
- Edit existing events
- Delete events
- View registration statistics
- Manage event capacity

## 🎨 Design System

### Color Palette
```css
Primary: Amber (#F59E0B)
Secondary: Orange (#F97316)
Accent: Yellow (#EAB308)
Success: Green (#22C55E)
Error: Red (#EF4444)
Neutral: Slate (#64748B)
```

### Typography
- **Headings:** Bold, hierarchical sizing
- **Body:** Clean, readable sans-serif
- **Quotes:** Italic styling for spiritual quotes

### Components
- **Cards:** Rounded corners with subtle shadows
- **Buttons:** Gradient backgrounds with hover effects
- **Forms:** Clean inputs with validation states
- **Modals:** Centered overlays with backdrop blur

## 🔧 Configuration

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:3000  # API endpoint (if using real backend)
```

### Mock Data
Currently uses mock data for demonstration. Key mock datasets:
- **Events:** 6 sample spiritual events
- **Users:** Admin and user accounts
- **Registrations:** Sample registration data

## 🚀 Deployment

### Netlify (Recommended)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure redirects for SPA routing

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🧪 Testing

### Manual Testing Scenarios

1. **Authentication Flow**
   - Login with demo credentials
   - Register new account
   - Logout functionality

2. **Event Management**
   - Browse events with filters
   - Register/cancel registrations
   - Admin event CRUD operations

3. **Responsive Design**
   - Test on mobile, tablet, desktop
   - Verify navigation and forms

## 🤝 Contributing

### Development Guidelines

1. **Code Style**
   - Use TypeScript for type safety
   - Follow ESLint configuration
   - Use Tailwind for styling

2. **Component Structure**
   - Keep components focused and reusable
   - Use proper TypeScript interfaces
   - Include error handling

3. **Git Workflow**
   - Create feature branches
   - Write descriptive commit messages
   - Test before submitting PRs

### Adding New Features

1. **New Event Types**
   - Update `categories` array in EventForm
   - Add corresponding icons/styling

2. **Additional User Roles**
   - Extend User interface in types
   - Update authentication logic
   - Add role-specific routes

## 📚 API Integration

### Current State
- Uses mock data for demonstration
- All CRUD operations simulate API calls
- Includes loading states and error handling

### Future Backend Integration
```typescript
// Example API service structure
const api = {
  events: {
    getAll: () => fetch('/api/events'),
    create: (event) => fetch('/api/events', { method: 'POST', body: JSON.stringify(event) }),
    update: (id, event) => fetch(`/api/events/${id}`, { method: 'PUT', body: JSON.stringify(event) }),
    delete: (id) => fetch(`/api/events/${id}`, { method: 'DELETE' })
  },
  auth: {
    login: (credentials) => fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(userData) })
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript Errors**
   ```bash
   # Check TypeScript configuration
   npx tsc --noEmit
   ```

3. **Styling Issues**
   ```bash
   # Rebuild Tailwind CSS
   npm run build
   ```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **ISKCON** - For the spiritual inspiration and community
- **Srila Prabhupada** - Founder-Acharya of ISKCON
- **Bhagavad Gita** - Source of spiritual quotes
- **React Community** - For the amazing ecosystem
- **Tailwind CSS** - For the beautiful styling system

## 📞 Support

For questions, suggestions, or spiritual discussions:

- **Email:** events@iskcon.org
- **Website:** [ISKCON Official](https://iskcon.org)
- **Community:** Join our local ISKCON temple

---

### 🕉️ Spiritual Quote

> *"Engage your mind always in thinking of Me, become My devotee, offer obeisances to Me and worship Me. Being completely absorbed in Me, surely you will come to Me."*
> 
> **— Bhagavad Gita 9.34**

---

**Hare Krishna Hare Krishna Krishna Krishna Hare Hare**  
**Hare Rama Hare Rama Rama Rama Hare Hare** 🙏

Made with devotion for the Krishna consciousness community ❤️