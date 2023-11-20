/* eslint-disable no-undef */
var request= require("supertest");
const app = require('./index.js');
const db = require("./config/db.js")
const { Sequelize } = require('sequelize');

var loc = Sequelize.fn('ST_GeomFromText', 'POINT(-33.0000000 -70.0000000)')

beforeAll(async () => {
  db.sequelize.authenticate()
  // eslint-disable-next-line no-unused-vars
  const testCinema = await db.Cinema.create({
    name: 'Cine Prueba',
      location: loc,
      createdAt: new Date(),
      updatedAt: new Date()
  })
  var {count, rows} = await db.Cinema.findAndCountAll()
  const testShow = await db.Show.create({
    title: "Batman Prueba",
      schedule: "12:00:00",
      link_to_show: "aaalink1",
      link_to_picture: "aaalink2",
      id_cinema: count,
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date("2023-11-27")
  })
})

afterAll(async () => {
  const testShow = await db.Show.findOne({ where: { title: 'Batman Prueba' } })
  console.log(await db.Cinema.findAll())
  const testCinema = await db.Cinema.findOne({ where: { title: 'Cine Prueba' }})
  console.log(testCinema)
  await testShow.destroy()
  await testCinema.destroy()
  await db.sequelize.close()
})

describe("Shows", () => {
    it("test-noShowsWithTitle", async () => {
      const res = await request(app)
      .post('/search')
      .send({
        "location": "Latitude: -33.417052, Longitude: -70.5100854",
        "movie": "Batman Prueba 3",
        "currentLocation": true,
        "date": "2023-11-15"
    })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual([ [], 'Batman Prueba 3' ])
    
  });

  it("test-ShowsWithDate", async () => {
      const res = await request(app)
      .post('/search')
      .send({
        "location": "Latitude: -33.0000000, Longitude: -70.0000000",
        "movie": "Batman Prueba",
        "currentLocation": true,
        "date": "2023-11-27"
    })
        expect(res.statusCode).toEqual(200)
        console.log(res.body)
        expect(res.body).toEqual([ [], 'Batman Prueba' ])
  });

})

describe('GET /', () => {
  it('responds with "Hello, World!"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hola mundo esto es una demo!');
  });
});