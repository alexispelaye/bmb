import express from 'express';

const port = 3000;
const app = express();

app.get('/', (req, res) => {
  res.send('Hola mundo');
})

app.listen(port, () => {
  console.log(`Server listen on port ${port}`)
})
