import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport.js';
import habitRouter from './routes/habits.js';
import taskRouter from './routes/tasks.js';
import authRouter from './routes/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/habits', habitRouter);
app.use('/tasks', taskRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.status(200).send('streak server');
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});