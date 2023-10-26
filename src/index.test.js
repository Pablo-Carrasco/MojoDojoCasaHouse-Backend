/* eslint-disable no-undef */
const app = require('./index.js');
const request = require('supertest');

describe('GET /', () => {
  it('responds with "Hello, World!"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Holaa Mundo esta es una demo!');
  });
});