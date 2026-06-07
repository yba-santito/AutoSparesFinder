// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const dbService = require('./db-service');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production';

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) return res.status(401).json({ error: 'Invalid or expired token' });
            req.user = decoded;
            next();
        });
    } else {
        res.status(401).json({ error: 'No token provided' });
    }
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await dbService.loginUser(username, password);
        if (!user) return res.status(401).json({ success: false, error: 'Invalid username or password' });
        
        const token = jwt.sign({ id: user.user_id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
        res.json({ success: true, token, user: { username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error during authentication' });
    }
});

// Dropdowns and catalog lookups
app.get('/api/part-types', async (req, res) => {
    try {
        const data = await dbService.getAllPartTypes();
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/vehicles', async (req, res) => {
    try {
        const data = await dbService.getAllVehicles();
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/search-parts', async (req, res) => {
    try {
        const { make, model, year } = req.query;
        const data = await dbService.getPartsForVehicle(make, model, year);
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Secured Administration Hooks
app.get('/api/admin/parts', verifyToken, async (req, res) => {
    try {
        const data = await dbService.getAllParts();
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/admin/parts', verifyToken, async (req, res) => {
    try {
        const partId = await dbService.addPart(req.body);
        res.status(201).json({ success: true, part_id: partId });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/admin/parts/:id', verifyToken, async (req, res) => {
    try {
        await dbService.updatePart(req.params.id, req.body);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/admin/parts/:id', verifyToken, async (req, res) => {
    try {
        await dbService.deletePart(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/admin/part-leads', verifyToken, async (req, res) => {
    try {
        const leads = await dbService.getPartLeadsWithAvailability();
        res.json(leads);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/admin/part-leads/:id/status', verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['unattended', 'attended', 'approved', 'failed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status attribute value' });
        }
        await dbService.updateLeadStatus(req.params.id, status);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Open Public Lead Intake
app.post('/api/part-leads', async (req, res) => {
    try {
        const leadId = await dbService.savePartLead(req.body);
        res.status(201).json({ success: true, lead_id: leadId });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

const frontendDist = path.join(__dirname, 'spares-frontend', 'dist');
app.use(express.express?.static ? express.static(frontendDist) : express.static(frontendDist));
app.get(/.*/, (req, res) => res.sendFile(path.join(frontendDist, 'index.html')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend tracking server active on port ${PORT}`));