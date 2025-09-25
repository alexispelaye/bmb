import express from 'express';
import authRouter from './routes/auth.route';

const port = 3000;
const app = express();

app.get('/', (req, res) => {
  res.send('Hola mundo');
})

app.use('/api', authRouter);

app.listen(port, () => {
  console.log(`Server listen on port ${port}`)
})
