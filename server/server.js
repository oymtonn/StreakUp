import express from 'express';
import cors from 'cors';
import habitRouter from './routes/habits.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/habits', habitRouter);

app.get('/', (req, res) => {
    res.status(200).send('streak server')
})

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost${PORT}`);
})