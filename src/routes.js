import { Router } from 'express';
import expressJWT from 'express-jwt';

import config from './config';

import * as auth from './controllers/auths';

const routes = Router();

const jwtMiddleware = expressJWT({
  secret: config.JWT_SECRET,
  algorithms: [config.JWT_ALGORITHM],
  issuer: 'api.notblessy.id',
});

routes.get('/', (_, res) => {
  return res.json({ ping: 'pong!' });
});

routes.post('/register', auth.register);
routes.post('/login', auth.login);
routes.get('/profile', jwtMiddleware, auth.profile);
routes.put('/profile', jwtMiddleware, auth.edit);


export default routes;
