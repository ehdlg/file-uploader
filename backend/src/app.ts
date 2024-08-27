import express from 'express';
import { handleError, notFound } from './middlewares';
import apiRoute from './routes/apiRoute';
import 'dotenv/config';

const app = express();
const { PORT } = process.env;

app.use(express.json());

app.use('/api', apiRoute);

app.use(notFound);

app.use(handleError);

app.listen(PORT, () => {
  console.log(`Listening on: http://localhost:${PORT}`);
});
