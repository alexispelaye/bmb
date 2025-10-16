import express from 'express';
import apiRouter from './routes/api.route';
import cors from 'cors';

const port = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`Server listen on port ${port}`)
});
