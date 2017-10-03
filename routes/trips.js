const express    = require('express');
const router     = express.Router();
const Trip      = require('../models/trip').Trip;

const response = require('../helpers/responses');


//LIST ALL THE TRIPS
router.get('/', (req, res, next) => {
  let filters = {};
  // console.log(req.query.searchTerm);
  // console.log(req.query.startLocation);
  Trip.find(filters, (err, trips) => {
    if (err) {
      return next(res);
    }
    let data = trips.map((trip) => {
      return trip.asData();
    });
    return response.data(req, res, data);
  });
});


//ONE TRIP **************
router.get('/:id', (req, res, next) => {

  if (!req.params.id.match(/^[a-zA-Z0-9]{24}$/)) {
    return response.notFound(req, res);
  }
  Trip.findById(req.params.id, (err, trip) => {
    if (err) {
      return next(err);
    }
    if (!trip) {
      return response.notFound(req, res);
    }
    let data = trip.asData();
    return response.data(req, res, data);
  });
});


module.exports = router;
