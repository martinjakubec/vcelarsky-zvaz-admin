import express from 'express';

const districtRouter = express.Router();

districtRouter.get('/', (req, res) => {
  res.send('Hello from districts!');
});

districtRouter.get('/:id', (req, res) => {
  res.send(`Hello from district ${req.params.id}!`);
});

export default districtRouter;
