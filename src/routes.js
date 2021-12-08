import { Router } from 'express';
import expressJWT from 'express-jwt';

import config from './config';

import * as auth from './controllers/auths';
import * as category from './controllers/shoe_categories';
import * as shoe from './controllers/shoes';
import * as customer from './controllers/customers';
import * as customerOwnership from './controllers/customer_ownerships';

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

routes.get("/categories", jwtMiddleware, category.all);
routes.get("/categories/:id", jwtMiddleware, category.detail);
routes.post("/categories", jwtMiddleware, category.create);
routes.put("/categories/:id", jwtMiddleware, category.edit);
routes.delete("/categories", jwtMiddleware, category.destroy);

routes.get("/shoes", jwtMiddleware, shoe.all);
routes.get("/shoes/:id", jwtMiddleware, shoe.detail);
routes.post("/shoes", jwtMiddleware, shoe.create);
routes.put("/shoes/:id", jwtMiddleware, shoe.edit);
routes.delete("/shoes", jwtMiddleware, shoe.destroy);

routes.get("/customers", jwtMiddleware, customer.all);
routes.get("/customers/:id", jwtMiddleware, customer.detail);
routes.post("/customers", jwtMiddleware, customer.create);
routes.put("/customers/:id", jwtMiddleware, customer.edit);
routes.delete("/customers", jwtMiddleware, customer.destroy);

routes.get("/customer-ownerships", jwtMiddleware, customerOwnership.all);
routes.get("/customer-ownerships/:id", jwtMiddleware, customerOwnership.detail);
routes.post("/customer-ownerships", jwtMiddleware, customerOwnership.create);
routes.put("/customer-ownerships/:id", jwtMiddleware, customerOwnership.edit);
routes.delete("/customer-ownerships", jwtMiddleware, customerOwnership.destroy);


export default routes;
