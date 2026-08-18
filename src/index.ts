import 'dotenv/config';
import express from 'express';
import askRoute from './routes/ask';

const app = express();
app.use(express.json());
app.use('/api', askRoute);

app.listen(3000, () => console.log('Servidor a correr em http://localhost:3000'));