import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import apiRouter from './routes/api.route';
import cors from 'cors';
import { ValidationError } from './controllers/auth.controller';

const port = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const errorHandler: ErrorRequestHandler = (err: ValidationError | Error, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: 'error',
      message: JSON.parse(err.message)
    })
  }
  console.error(err, typeof err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
}

app.use('/api', apiRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listen on port ${port}`)
});
