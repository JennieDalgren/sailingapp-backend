const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const TripSchema = new Schema({
  startLocation: { type: String },
  endLocation: { type: String },
  photos: { type: Array },
  startDate: { type: Date },
  endDate: { type: Date },
  availableSpots: { type: Number },
  host: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  bookings: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    guestcount: { type: Number },
    message: { type: String },
    status: { type: String, default: 'pending' }
  }],
  price: { type: String },
  boat: { type: String },
  name: { type: String },
  description: {type: String },
  tripLength: { type: Number }
});

//THIS IS FOR THE HOST TO CREATE TRIP
// royuter.post(/trips
//   let trip new Trip(req.body)
//   trip.host = req.passport.user.id;
//
//THIS IS FOR THE GUEST TO BOOK TRIP
// router.post(/trip/:id/booking)
//   Trip.findById(req.param.id, (err, trip)
//     if (!trip) notFound
//     trip.bookins.push({
//       userId: req.hksdfhjfdsbhjfdsbhjfds
//       guestcount: req.body.guestcount
//     })
//





TripSchema.methods.asData = function() {
  return {
    id: this._id,
    startLocation: this.startLocation,
    endLocation: this.endLocation,
    photos: this.photos,
    startDate: this.startDate,
    endDate: this.endDate,
    availableSpots: this.availableSpots,
    host: this.host,      //GET USER FROM DATABASE
    // bookings: [{userid, guestcount, statut confirmed/pending}],
    price: this.price,
    tripName: this.tripName,
    description: this.description
  };
};

const Trip = mongoose.model('Trip', TripSchema);

module.exports = {
  Trip
};
