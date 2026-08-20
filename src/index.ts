import 'dotenv/config';
import express from 'express';
import askRoute from './routes/ask';
import productsRoute from './routes/products'
import categoriesRoute from './routes/categories'

const app = express();
app.use(express.json());
app.use('/api', askRoute);
app.use('/api', productsRoute);
app.use('/api', categoriesRoute);

app.listen(3000, () => console.log('Servidor a correr em http://localhost:3000'));