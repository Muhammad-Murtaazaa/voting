const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const { generalLimiter } = require('./middleware/rateLimiter');
const setupSocketIO = require('./utils/socketHandler');

const { getAllowedOrigins } = require('./config/urls');

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: getAllowedOrigins(),
    methods: ['GET', 'POST'],
    credentials: true
  }
});

global.io = io;
const socketHandlers = setupSocketIO(io);
global.socketHandlers = socketHandlers;

app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors({
  origin: getAllowedOrigins(),
  credentials: true
}));

app.use(generalLimiter);

app.use((req, res, next) => {
  req.io = io;
  req.socketHandlers = socketHandlers;
  next();
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'iVotePK API - Intelligent Voting System',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      register: 'POST /api/auth/register',
      vote: '/api/vote',
      elections: '/api/public',
      admin: '/api/admin'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    service: 'ivotepk-api',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/auth', (req, res) => {
  res.json({
    success: true,
    message: 'Auth API — most routes require POST with JSON body',
    routes: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      verifyOtp: 'POST /api/auth/verify-otp',
      resendOtp: 'POST /api/auth/resend-otp',
      me: 'GET /api/auth/me (Bearer token)'
    }
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vote', require('./routes/voteRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.use(errorHandler);

app.use((req, res) => {
  const hint = req.path.startsWith('/api/auth/register')
    ? ' This endpoint only accepts POST requests, not GET.'
    : '';
  res.status(404).json({
    success: false,
    message: `Route not found.${hint}`,
    method: req.method,
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║         iVotePK - Intelligent Voting System          ║
║                                                       ║
║  Server running on port ${PORT}                         ║
║  Environment: ${process.env.NODE_ENV || 'development'}                      ║
║                                                       ║
║  API Endpoints:                                       ║
║  - Auth:       /api/auth                             ║
║  - Vote:       /api/vote                             ║
║  - Public:     /api/public                           ║
║  - Admin:      /api/admin                            ║
║                                                       ║
║  Socket.IO: Real-time analytics enabled              ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});
