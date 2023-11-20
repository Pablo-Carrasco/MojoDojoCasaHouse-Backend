/* eslint-disable no-undef */
const app = require('./index.js');
const request = require('supertest');

const dummyCinema1 = {
  id: 1,
  name: "Cinemark Alto Las Condes",
  location: { type: "Point", coordinates: [-33.3911981, -70.5475219] },
  createdAt: "2023-11-13T22:33:17.933Z",
  updatedAt: "2023-11-13T22:33:17.933Z",
  shows: [
    {
      id: 1,
      title: "Barbie",
      schedule: "11:00:00",
      link_to_show: "aaalink1",
      link_to_picture: "aaalink2",
      id_cinema: 1,
      date: new Date("2023-11-15"),
      createdAt: "2023-11-13T22:33:18.432Z",
      updatedAt: "2023-11-13T22:33:18.432Z",
    },
    {
      id: 2,
      title: "Openheimer",
      schedule: "13:30:00",
      link_to_show: "aaalink1",
      link_to_picture: "aaalink2",
      date: new Date("2023-11-21"),
      id_cinema: 1,
      createdAt: "2023-11-13T22:33:18.587Z",
      updatedAt: "2023-11-13T22:33:18.587Z",
    },
  ],
};
const dummyCinema2 = {
  id: 2,
  name: "Cine Hoyts Parque Arauco",
  location: { type: "Point", coordinates: [-33.4020268, -70.5812211] },
  createdAt: "2023-11-13T22:33:18.107Z",
  updatedAt: "2023-11-13T22:33:18.107Z",
  shows: [
    {
      id: 3,
      title: "Finding Nemo",
      schedule: "14:00:00",
      link_to_show: "aaalink1",
      link_to_picture: "aaalink2",
      id_cinema: 2,
      date: new Date("2023-11-25"),
      createdAt: "2023-11-13T22:33:18.740Z",
      updatedAt: "2023-11-13T22:33:18.740Z",
    },
  ],
};
const dummyCinema3 = {
  id: 3,
  name: "Cineplanet La Dehesa",
  location: { type: "Point", coordinates: [-33.3568727, -70.5169774] },
  createdAt: "2023-11-13T22:33:18.270Z",
  updatedAt: "2023-11-13T22:33:18.270Z",
  shows: [],
};

describe("Shows", () => {
    const db = [dummyCinema1, dummyCinema2, dummyCinema3];

    it("test-noShowsWithTitle", async () => {
      const res = await request(app)
      .post('/search')
      .send({
        "location": "Latitude: -33.417052, Longitude: -70.5100854",
        "movie": "Barbie",
        "currentLocation": true,
        "date": "2023-11-15"
    })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual([])
    
  });

  it("test-noShowsWithDate", async () => {
      const res = await request(app)
      .post('/search')
      .send({
        "location": "Latitude: -33.417052, Longitude: -70.5100854",
        "movie": "Batman",
        "currentLocation": true,
        "date": "2023-11-15"
    })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual([])
    
  });

})

describe('GET /', () => {
  it('responds with "Hello, World!"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hola mundo esto es una demo!');
  });
});