const express    = require('express');
const router     = express.Router();
const Trip       = require('../models/trip').Trip;
const response   = require('../helpers/response');
const upload     = require('../config/multer');

//LIST ALL THE TRIPS
router.get('/', (req, res, next) => {
  let filters = {};
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

//LIST ALL MY HOSTED TRIPS
router.get('/hosted', (req, res, next) => {
  let filters = {host: req.user._id};
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

//LIST ALL MY ATTENDING TRIPS
router.get('/attending', (req, res, next) => {
  let filters = {bookings: { $elemMatch: {userId: req.user._id} } };
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

//ONE TRIP
router.get('/:id', (req, res, next) => {

  if (!req.params.id.match(/^[a-zA-Z0-9]{24}$/)) {
    return response.notFound(req, res);
  }
  Trip.findById(req.params.id)
    .populate('host', 'name phoneNumber photo email')
    .populate('bookings.userId', 'name phoneNumber photo email')
    .exec ((err, trip) => {
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

//UPLOAD TRIPFILE
router.post('/upload', upload.single('file'), (req, res, next) => {
  const data = {
    fileName: `/uploads/${req.file.filename}`

  };
  return response.data(req, res, data);
});

//CREATE A TRIP (as a host)
router.post('/', (req, res, next) => {
  //this is to calculate the trip length
  var day_start = new Date(req.body.startDate);
  var day_end = new Date(req.body.endDate);
  var total_days = (day_end - day_start) / (1000 * 60 * 60 * 24);

  const newTrip = new Trip({
    name: req.body.name,
    boat: req.body.boat,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    startLocation: req.body.startLocation,
    endLocation: req.body.endLocation,
    description: req.body.description,
    price: req.body.price,
    availableSpots: req.body.availableSpots,
    photos:[ req.body.fileName ],
    host: req.user._id,
    tripLength: total_days
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


//BOOK A TRIP (as a guest)
router.post('/:id', (req, res, next) => {

  const tripUpdate = {
    $push: {
      'bookings': {
        userId: req.user._id,
        guestcount: req.body.guestCount,
        message: req.body.message,
        status: 'pending'
      }
    }
  };

  Trip.findByIdAndUpdate(req.params.id, tripUpdate, (err, trip) => {
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


//HANDLE BOOKING (as a host)
router.get('/:tripId/booking/:bookingId/:status', (req, res, next) => {
  Trip.findOneAndUpdate( {_id:req.params.tripId,
    "bookings._id":req.params.bookingId},
    {$set: {"bookings.$.status": req.params.status}}, (err, trip) => {
    if (err) {
      return next(err);
    }
    if (!trip) {
      return response.notFound(req, res);
    }
    return res.json(trip);
  });
});

module.exports = router;
