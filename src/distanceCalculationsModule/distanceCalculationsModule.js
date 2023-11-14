class DistanceCalculationsModule {
  constructor() {}

  getNearbyCinemas(point, cinemas) {
    return this.#getCinemaByCriteria(point, cinemas);
  }

  #getCinemaByCriteria(point, cinemas) {
    var list = [];
    list = this.#getCinemasIn5KM(point, cinemas);
    if (list.length == 0) {
      list = this.#getCinemasIn10KM(point, cinemas);
    }
    return list;
  }

  #getCinemasIn5KM(point, cinemas) {
    var list = [];
    cinemas.forEach((cinema) => {
      const cinemaCoordinates = cinema.location.coordinates;
      const distaneBetweenCinemaAndUser = this.#getDistanceBetweenPoints(
        point.coordinates,
        cinemaCoordinates
      );
      if (distaneBetweenCinemaAndUser <= 5) {
        list.push(cinema);
      }
    });
    return list;
  }

  #getCinemasIn10KM(point, cinemas) {
    var list = [];
    cinemas.forEach((cinema) => {
      const cinemaCoordinates = cinema.location.coordinates;
      const distaneBetweenCinemaAndUser = this.#getDistanceBetweenPoints(
        point.coordinates,
        cinemaCoordinates
      );
      if (distaneBetweenCinemaAndUser <= 10) {
        list.push(cinema);
      }
    });
    return list;
  }

  #getDistanceBetweenPoints(firstPoint, secondPoint) {
    var lat1 = firstPoint[0];
    var lon1 = firstPoint[1];
    var lat2 = secondPoint[0];
    var lon2 = secondPoint[1];
    var R = 6371; // km
    var dLat = this.#turnToRadian(lat2 - lat1);
    var dLon = this.#turnToRadian(lon2 - lon1);
    var lat1 = this.#turnToRadian(lat1);
    var lat2 = this.#turnToRadian(lat2);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  #turnToRadian(Value) {
    return (Value * Math.PI) / 180;
  }
}

module.exports = DistanceCalculationsModule;
