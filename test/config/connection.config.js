import supertest from 'supertest';

import { app } from '../../src/config/express.config.js';

export const request = supertest(app);
