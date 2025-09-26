import express from 'express';
import apiRouter from './routes/api.route';

const port = 3000;
const app = express();

app.use(express.json());

app.use('api/', apiRouter);

app.listen(port, () => {
  console.log(`Server listen on port ${port}`)
});
