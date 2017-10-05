const express    = require('express');
const router     = express.Router();
const Trip      = require('../models/trip').Trip;

const response = require('../helpers/response');
const upload = require('../config/multer');

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
    //console.log('home: ', req.user);
    return response.data(req, res, data);
  });
});


//ONE TRIP
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
    //console.log('single trip: ', req.user);
    let data = trip.asData();
    return response.data(req, res, data);
  });
});

//UPLOAD FILE
router.post('/upload', upload.single('file'), (req, res, next) => {
  const data = {
    fileName: `/uploads/${req.file.filename}`

  };
  //console.log('upload: ', req.user);
  return response.data(req, res, data);
});

//CREATE A TRIP (as a host)
router.post('/', (req, res, next) => {

  //console.log("trip: ", req.user);
  const newTrip = new Trip({
    name: req.body.name,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    startLocation: req.body.startLocation,
    endLocation: req.body.endLocation,
    description: req.body.description,
    price: req.body.price,
    availableSpots: req.body.availableSpots,
    photos:[ req.body.fileName ],
    host: req.user._id

  });

  newTrip.save( (err) => {
    if (err) {
      return response.unexpectedError(err);
    }
    if (newTrip.errors) {
      return response.notFound(req, res);
    }
    let data = newTrip.asData();
    return response.data(req, res, data);
  });
});




module.exports = router;
