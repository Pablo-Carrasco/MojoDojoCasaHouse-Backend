/* eslint-disable no-undef */
const app = require('./index.js');
const request = require('supertest');
const db = require("./config/db.js")
const { Sequelize } = require('sequelize');

var loc = Sequelize.fn('ST_GeomFromText', 'POINT(-33.0000000 -70.0000000)')

beforeAll(async () => {
  db.sequelize.authenticate()
  // eslint-disable-next-line no-unused-vars
  var testCinema = null
  try{
    testCinema = await db.Cinema.create({
    name: 'Cine Prueba',
      location: loc,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: 5000
  })
  } catch (e) {
    console.error(e)
  }
  const testShow = await db.Show.create({
    title: "Batman Prueba",
      schedule: "12:00:00",
      link_to_show: "aaalink1",
      link_to_picture: "aaalink2",
      id_cinema: 5000,
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date("2023-11-27")
  })
  const testShow2 = await db.Show.create({
    title: "Joker Prueba",
      schedule: "17:00:00",
      link_to_show: "aaalink1",
      link_to_picture: "aaalink2",
      id_cinema: 5000,
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date("2023-11-27")
  })
})

afterAll(async () => {
  const testShow = await db.Show.findOne({ where: { title: 'Batman Prueba' } })
  const testShow2 = await db.Show.findOne({ where: { title: 'Joker Prueba' } })
  const testCinema = await db.Cinema.findOne({ where: { name: 'Cine Prueba' }})
  await testShow.destroy()
  await testCinema.destroy()
  await testShow2.destroy()
  await db.sequelize.close()
})

describe('GET /movies', () => {
  it("shows all movies", async () => {
    const response = await request(app).get('/movies');
    var check = response.body.includes('Joker Prueba')
    expect(response.status).toBe(200);
    expect(check).toEqual(true)
  });
  it("does not shows movies not created", async () => {
    const response = await request(app).get('/movies');
    var check = response.body.includes('Joker Prueba no esta')
    expect(response.status).toBe(200);
    expect(check).toEqual(false)
  });
});


describe('GET /', () => {
  it('responds with "Hello, World!"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hola mundo esto es una demo!');
  });
});