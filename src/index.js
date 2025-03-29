// external packages
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

// database connection
import './db/index.js';

// api routes setup
import createApi from './api/v1/index.js';

// MiniSearch setup
import { loadBooks } from './utils/miniSearch.js';

// environment vars
const PORT = process.env.PORT || 8000;

// express app instance
const app = express();

// set security HTTP headers
app.use(helmet());

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CORS_ORIGIN,
      "https://studybyte-six.vercel.app",
      "http://localhost:5173" // for local development
    ];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// enable CORS with options
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions))

// parse JSON request body
app.use(express.json({ limit: '10mb' }));

// serve static files from the 'public' directory
app.use(express.static('public'));

// parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data to prevent MongoDB query injection
app.use(mongoSanitize());

// health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: Date.now(),
    environment: process.env.NODE_ENV || 'development',
  });
});


// Load books into MiniSearch before handling API requests
loadBooks()
  .then(() => console.log('Books loaded into MiniSearch'))
  .catch((err) => console.error('Failed to load books into MiniSearch:', err));

// api routes
app.use('/api/v1', createApi());

// handle 404 errors
app.use('*', (req, res) => {
  res.status(404).send('404 Not found');
});

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;