// API Endpoints for Impact Web3 MVP
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Sample database connection - in a real implementation, this would connect to the actual database
const db = {
    users: [
        { id: 1, username: 'admin', passwordHash: '$2b$10$X7o4c5/QhS5t.7yL5WIB3.4ZJfV0sJKFXQVtZRf.7e9F9Z9jFGQ2W', role: 'admin' }, // password: admin123
        { id: 2, username: 'proposer', passwordHash: '$2b$10$lKJ5bx0QCxNXnGv4JQJ5qeAaGIzMGBUxQCvMsT9yvF6IpJ1jvKgXC', role: 'proposer' }, // password: proposer123
        { id: 3, username: 'evaluator', passwordHash: '$2b$10$3JfZy6rQnPHFb7hS9.U2/.6U7IGPF.FZGJFYf.5wYdgfnqAYOFjnK', role: 'evaluator' } // password: evaluator123
    ],
    projects: [],
    metrics: [],
    applications: [],
    reports: []
};

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Secret key for JWT
const JWT_SECRET = 'impact-web3-secret-key'; // In production, use environment variables

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        
        req.user = user;
        next();
    });
};

// Role-based authorization middleware
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        
        next();
    };
};

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Find user
    const user = db.users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
    
    res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    });
});

app.post('/api/auth/register', async (req, res) => {
    const { username, password, role } = req.body;
    
    // Check if username already exists
    if (db.users.some(u => u.username === username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Validate role
    const validRoles = ['proposer', 'evaluator', 'community'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
        id: db.users.length + 1,
        username,
        passwordHash,
        role
    };
    
    db.users.push(newUser);
    
    res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: newUser.id,
            username: newUser.username,
            role: newUser.role
        }
    });
});

// Project routes
app.get('/api/projects', authenticateToken, (req, res) => {
    // Return all projects or filter by user if not admin
    let projects = [...db.projects];
    
    if (req.user.role !== 'admin') {
        projects = projects.filter(p => p.userId === req.user.id);
    }
    
    res.json(projects);
});

app.get('/api/projects/:id', authenticateToken, (req, res) => {
    const project = db.projects.find(p => p.id === parseInt(req.params.id));
    
    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }
    
    // Check if user has access to this project
    if (req.user.role !== 'admin' && project.userId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(project);
});

app.post('/api/projects', authenticateToken, authorize(['admin', 'proposer']), (req, res) => {
    const { title, description, fundingRound, fundingAmount, startDate, endDate, blockchainAddress } = req.body;
    
    // Validate required fields
    if (!title || !description || !fundingRound) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create new project
    const newProject = {
        id: db.projects.length + 1,
        userId: req.user.id,
        title,
        description,
        fundingRound,
        status: 'proposed',
        fundingAmount: fundingAmount || null,
        startDate: startDate || null,
        endDate: endDate || null,
        blockchainAddress: blockchainAddress || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    db.projects.push(newProject);
    
    res.status(201).json(newProject);
});

app.put('/api/projects/:id', authenticateToken, authorize(['admin', 'proposer']), (req, res) => {
    const projectId = parseInt(req.params.id);
    const projectIndex = db.projects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
        return res.status(404).json({ error: 'Project not found' });
    }
    
    const project = db.projects[projectIndex];
    
    // Check if user has access to update this project
    if (req.user.role !== 'admin' && project.userId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    // Update project fields
    const updatedProject = {
        ...project,
        ...req.body,
        id: projectId, // Ensure ID doesn't change
        userId: project.userId, // Ensure user ID doesn't change
        updatedAt: new Date().toISOString()
    };
    
    db.projects[projectIndex] = updatedProject;
    
    res.json(updatedProject);
});

// Application form routes
app.post('/api/applications', authenticateToken, authorize(['admin', 'proposer']), (req, res) => {
    const { projectId, formData } = req.body;
    
    // Validate required fields
    if (!projectId || !formData) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if project exists
    const project = db.projects.find(p => p.id === parseInt(projectId));
    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }
    
    // Check if user has access to this project
    if (req.user.role !== 'admin' && project.userId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    // Create new application
    const newApplication = {
        id: db.applications.length + 1,
        projectId: parseInt(projectId),
        userId: req.user.id,
        formData,
        status: 'submitted',
        submissionDate: new Date().toISOString()
    };
    
    db.applications.push(newApplication);
    
    res.status(201).json(newApplication);
});

app.get('/api/applications', authenticateToken, (req, res) => {
    // Return all applications or filter by user if not admin/evaluator
    let applications = [...db.applications];
    
    if (req.user.role === 'proposer') {
        applications = applications.filter(a => a.userId === req.user.id);
    }
    
    res.json(applications);
});

// Reporting form routes
app.post('/api/reports', authenticateToken, authorize(['admin', 'proposer']), (req, res) => {
    const { projectId, reportingPeriodStart, reportingPeriodEnd, formData } = req.body;
    
    // Validate required fields
    if (!projectId || !reportingPeriodStart || !reportingPeriodEnd || !formData) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if project exists
    const project = db.projects.find(p => p.id === parseInt(projectId));
    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }
    
    // Check if user has access to this project
    if (req.user.role !== 'admin' && project.userId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    // Create new report
    const newReport = {
        id: db.reports.length + 1,
        projectId: parseInt(projectId),
        userId: req.user.id,
        reportingPeriodStart,
        reportingPeriodEnd,
        formData,
        status: 'submitted',
        submissionDate: new Date().toISOString()
    };
    
    db.reports.push(newReport);
    
    res.status(201).json(newReport);
});

app.get('/api/reports', authenticateToken, (req, res) => {
    // Return all reports or filter by user if not admin/evaluator
    let reports = [...db.reports];
    
    if (req.user.role === 'proposer') {
        reports = reports.filter(r => r.userId === req.user.id);
    }
    
    res.json(reports);
});

// Metrics and analytics routes
app.get('/api/metrics/categories', authenticateToken, (req, res) => {
    // Return metrics categories
    const categories = {
        social: ['community_engagement', 'job_creation', 'education_events', 'education_participants'],
        environmental: ['carbon_reduction', 'renewable_adoption', 'resource_efficiency'],
        economic: ['wallets_created', 'revenue_generation', 'businesses_impacted', 'individuals_impacted'],
        governance: ['partnerships', 'transparency_score', 'stakeholder_engagement']
    };
    
    res.json(categories);
});

app.get('/api/metrics/summary', authenticateToken, (req, res) => {
    // In a real implementation, this would calculate metrics from actual data
    // For the MVP, we'll return sample data
    
    const summary = {
        overallScore: 87.5,
        categoryScores: {
            social: 92.3,
            environmental: 78.6,
            economic: 85.2,
            governance: 94.0
        },
        topPerformingMetrics: [
            { id: 'renewable_adoption', name: 'Renewable Energy Adoption', achievementPercent: 108.3 },
            { id: 'wallets_created', name: 'New Wallets Created', achievementPercent: 108.0 },
            { id: 'carbon_reduction', name: 'Carbon Reduction', achievementPercent: 108.6 },
            { id: 'partnerships', name: 'Partnerships', achievementPercent: 106.7 }
        ],
        underperformingMetrics: [
            { id: 'resource_efficiency', name: 'Resource Efficiency', achievementPercent: 93.3 },
            { id: 'transparency_score', name: 'Transparency Score', achievementPercent: 97.8 },
            { id: 'education_events', name: 'Educational Events', achievementPercent: 95.0 },
            { id: 'job_creation', name: 'Job Creation', achievementPercent: 96.7 }
        ]
    };
    
    res.json(summary);
});

app.get('/api/metrics/trends', authenticateToken, (req, res) => {
    // In a real implementation, this would calculate trends from actual data
    // For the MVP, we'll return sample data
    
    const periods = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];
    
    const trends = {
        social: {
            community_engagement: {
                name: 'Community Engagement',
                periods,
                values: [450, 580, 750, 820],
                trend: 'increasing'
            },
            job_creation: {
                name: 'Job Creation',
                periods,
                values: [12, 18, 27, 32],
                trend: 'increasing'
            }
        },
        environmental: {
            carbon_reduction: {
                name: 'Carbon Reduction',
                periods,
                values: [15, 22, 28, 38],
                trend: 'increasing'
            },
            renewable_adoption: {
                name: 'Renewable Adoption',
                periods,
                values: [25, 35, 48, 65],
                trend: 'increasing'
            }
        },
        economic: {
            wallets_created: {
                name: 'New Wallets',
                periods,
                values: [850, 1400, 2100, 2700],
                trend: 'increasing'
            },
            revenue_generation: {
                name: 'Revenue (thousands)',
                periods,
                values: [45, 70, 105, 130],
                trend: 'increasing'
            }
        },
        governance: {
            partnerships: {
                name: 'Partnerships',
                periods,
                values: [6, 9, 13, 16],
                trend: 'increasing'
            },
            transparency_score: {
                name: 'Transparency Score',
                periods,
                values: [75, 82, 88, 96],
                trend: 'increasing'
            }
        }
    };
    
    res.json(trends);
});

// Blockchain verification routes
app.post('/api/blockchain/verify', authenticateToken, (req, res) => {
    const { projectId, responseId, responseType, blockchainType, transactionHash } = req.body;
    
    // Validate required fields
    if (!projectId || !responseId || !responseType || !blockchainType || !transactionHash) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // In a real implementation, this would verify the transaction on the blockchain
    // For the MVP, we'll simulate verification
    
    // Simulate verification delay
    setTimeout(() => {
        // Simulate successful verification
        const verification = {
            projectId: parseInt(projectId),
            responseId: parseInt(responseId),
            responseType,
            blockchainType,
            transactionHash,
            verificationDate: new Date().toISOString(),
            verificationStatus: 'verified',
            verificationData: {
                timestamp: new Date().toISOString(),
                blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
                confirmations: Math.floor(Math.random() * 100) + 1
            }
        };
        
        res.json(verification);
    }, 1000);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
