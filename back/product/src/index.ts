import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import connectDB from './config/db';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use('/api/auth', authRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})


