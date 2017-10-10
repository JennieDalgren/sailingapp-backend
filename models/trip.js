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
    name: this.name,
    boat: this.boat,
    description: this.description,
    tripLength: this.tripLength,
    bookings: this.bookings
  };
};

const Trip = mongoose.model('Trip', TripSchema);

module.exports = {
  Trip
};
