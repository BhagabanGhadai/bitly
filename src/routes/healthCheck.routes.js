import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.status(200).send({
    status: 'OK',
    message: 'Server is up and running',
  });
});

export { router as healthCheckRouter };
