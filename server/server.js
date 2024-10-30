import express from 'express';
const app = express();
const port = process.env.PORT || 3000;
import homeRouter from './routes/index.js';

app.use('/', homeRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
