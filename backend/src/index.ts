import express, {Request, Response} from 'express';
import path from 'path';
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'dist')));
// app.get('/', (_req: Request, res: Response) => {
//   res.send('Hello World!');
// });

app.listen(3000, () => {
  console.log('listening on port 3000');
});
