import express from 'express';

const memberRouter = express.Router();

memberRouter.get('/', (req, res) => {
  res.send('Hello from members!');
});

memberRouter.get('/:id', (req, res) => {
  res.send(`Hello from member ${req.params.id}!`);
});

export default memberRouter;
