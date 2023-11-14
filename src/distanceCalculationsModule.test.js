/* eslint-disable no-undef */
const DistanceCalculationsModule = require("./distanceCalculationsModule/distanceCalculationsModule.js");
const request = require("supertest");

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
      createdAt: "2023-11-13T22:33:18.432Z",
      updatedAt: "2023-11-13T22:33:18.432Z",
    },
    {
      id: 2,
      title: "Openheimer",
      schedule: "13:30:00",
      link_to_show: "aaalink1",
      link_to_picture: "aaalink2",
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

describe("Distance Calculations", () => {
  it("test-allPointsAreIn5KM", async () => {
    const point = { type: "Point", coordinates: [-33.3911981, -70.5475219] };
    const db = [dummyCinema1, dummyCinema2, dummyCinema3];
    const result = new DistanceCalculationsModule().getNearbyCinemas(point, db);
    expect(result).toEqual(db);
  });
  it("test-somePointsAreIn5KM", async () => {
    const point = { type: "Point", coordinates: [-33.4, -70.55] };
    const db = [dummyCinema1, dummyCinema2, dummyCinema3];
    const result = new DistanceCalculationsModule().getNearbyCinemas(point, db);
    expect(result).toEqual([dummyCinema1, dummyCinema2]);
  });
  it("test-somePointsAreBetween5KMAnd10KM", async () => {
    const point = { type: "Point", coordinates: [-33.45, -70.6] };
    const db = [dummyCinema1, dummyCinema2, dummyCinema3];
    const result = new DistanceCalculationsModule().getNearbyCinemas(point, db);
    expect(result).toEqual([dummyCinema1, dummyCinema2]);
  });
  it("test-AllPointsAreFartherThan10KM", async () => {
    const point = { type: "Point", coordinates: [-34, -71] };
    const db = [dummyCinema1, dummyCinema2, dummyCinema3];
    const result = new DistanceCalculationsModule().getNearbyCinemas(point, db);
    expect(result).toEqual([]);
  });
});
