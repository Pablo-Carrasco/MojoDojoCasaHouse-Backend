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
    testCinema7 = await db.Cinema.create({
    name: 'Cine Prueba',
      location: loc,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: 5000
  })
  } catch (e) {
    console.error(e)
  }
  const testShow9 = await db.Show.create({
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
  const testShow3 = await db.Show.create({
    title: "Joker Prueba",
      schedule: "14:00:00",
      link_to_show: "aaalink1",
      link_to_picture: "aaalink2",
      id_cinema: 5000,
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date("2023-11-28")
  })
  const testShow4 = await db.Show.create({
    title: "Joker Prueba",
      schedule: "11:00:00",
      link_to_show: "aaalink1",
      link_to_picture: "aaalink2",
      id_cinema: 5000,
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date("2023-11-29")
  })
})

afterAll(async () => {
  const testShow9 = await db.Show.findOne({ where: { title: 'Batman Prueba' } })
  const testShow2 = await db.Show.findOne({ where: { title: 'Joker Prueba', schedule: '17:00:00' } })
  const testShow3 = await db.Show.findOne({ where: { title: 'Joker Prueba', schedule: '14:00:00' } })
  const testShow4 = await db.Show.findOne({ where: { title: 'Joker Prueba', schedule: '11:00:00' } })
  const testCinema7 = await db.Cinema.findOne({ where: { name: 'Cine Prueba' }})
  await testShow9.destroy()
  await testCinema7.destroy()
  await testShow2.destroy()
  await testShow3.destroy()
  await testShow4.destroy()
  await db.sequelize.close()
})

describe("Movies", () => {
    it("shows the 3 shows created in that cinema", async () => {
      const res = await request(app)
      .post('/movieInfo')
      .send({
        "cinema_id": 5000,
        "movie_title": "Joker Prueba"
      })
        expect(res.statusCode).toEqual(200)
        console.log(res.body.shows)
        expect(res.body.shows.length).toEqual(3)
        
  })
})

describe('GET /movies', () => {
  it("shows all movies", async () => {
    const response = await request(app).get('/movies');
    var check = response.body.includes('Joker Prueba') && response.body.includes('Batman Prueba')
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