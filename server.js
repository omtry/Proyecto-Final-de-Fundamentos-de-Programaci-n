const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'BK Server is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/user/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        // Here you could fetch user data from Firestore
        res.json({ 
            uid, 
            message: 'User endpoint - implement Firestore queries here' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 BK Server running on http://localhost:${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} to view the app`);
});
