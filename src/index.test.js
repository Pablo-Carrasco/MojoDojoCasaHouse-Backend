// import { request } from 'supertest';
// import app from './index.js';

const app = require('./index.js');
const request = require('supertest');

describe('GET /', () => {
  it('responds with "Hello, World!"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Holaa Mundo de Desarrollo de Software!');
  });
});