import express from 'express';
import mongoose from 'mongoose';
import apiRoutes from './routes/index.js';

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/inventory-lab')
  .then(() => console.log('DB Connected'))
  .catch(err => console.error('DB Error', err));

app.use('/api', apiRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));