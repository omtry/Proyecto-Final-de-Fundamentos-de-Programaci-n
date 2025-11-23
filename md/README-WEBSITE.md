# Bookey Website - Express.js + HTML

This project serves a traditional website using Express.js and static HTML files from the `frontend` folder.

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start the server
```bash
npm run server
```

### 3. Open your browser
Visit `http://localhost:3001` to see the website.

## 📁 Project Structure

```
Proyecto-Final-de-Fundamentos-de-Programaci-n-main/
├── frontend/                    # HTML files for the website
│   ├── index.html              # Home page (/)
│   ├── about.html              # About page (/about)
│   ├── rooms.html              # Rooms page (/rooms)
│   └── profile.html            # Profile page (/profile)
├── server.js                   # Express.js server
└── package.json                # Dependencies and scripts
```

## 🌐 Website Routes

- **Home**: `http://localhost:3001/` - Main landing page
- **About**: `http://localhost:3001/about` - About us page
- **Rooms**: `http://localhost:3001/rooms` - Rooms listing page
- **Profile**: `http://localhost:3001/profile` - User profile page

## 🔧 API Endpoints

The server also provides API endpoints:

- **Health Check**: `GET /api/health` - Server status
- **User Info**: `GET /api/user/:uid` - User information

## 📱 Features

### Home Page (/)
- Hero section with call-to-action
- Feature cards explaining the service
- Navigation to other pages

### About Page (/about)
- Company information
- Mission and values
- Contact details

### Rooms Page (/rooms)
- List of available rooms
- Room details and descriptions
- Reservation functionality (demo)

### Profile Page (/profile)
- User profile information
- Statistics and activity
- Tabbed interface for different sections

## 🎨 Styling

All pages use:
- CSS custom properties (CSS variables) for consistent theming
- Responsive design with mobile-first approach
- Modern UI with clean typography and spacing
- Hover effects and smooth transitions

## 🔄 Navigation

The website includes:
- Consistent navigation header across all pages
- Active page highlighting
- Smooth transitions between pages
- Mobile-responsive navigation

## 🛠️ Development

### Adding New Pages

1. Create a new HTML file in the `frontend/` folder
2. Add a route in `server.js`:
   ```javascript
   app.get('/new-page', (req, res) => {
       res.sendFile(path.join(__dirname, 'frontend', 'new-page.html'));
   });
   ```
3. Update navigation links in all HTML files

### Modifying Styles

- All styles are inline in each HTML file
- Use CSS custom properties for consistent theming
- Follow the existing design patterns

### Adding API Endpoints

Add new endpoints in `server.js`:
```javascript
app.get('/api/new-endpoint', (req, res) => {
    res.json({ message: 'New endpoint response' });
});
```

## 📦 Dependencies

- **express**: Web framework for Node.js
- **cors**: Cross-Origin Resource Sharing middleware
- **path**: Node.js path utility

## 🚀 Deployment

The server can be deployed to any Node.js hosting service:

1. Ensure all dependencies are installed
2. Set the `PORT` environment variable if needed
3. Start the server with `node server.js`

## 🔍 Troubleshooting

### Server won't start
- Check if port 3001 is available
- Ensure all dependencies are installed with `npm install`

### Pages not loading
- Verify the HTML files exist in the `frontend/` folder
- Check the server console for error messages
- Ensure the routes are correctly defined in `server.js`

### Styling issues
- Check browser developer tools for CSS errors
- Verify all CSS custom properties are defined
- Test responsive design on different screen sizes
