import mongoose from 'mongoose';

const cart = new mongoose.Schema({
    img: {
        type: String,
        required: true,
        trim: true,
      },
    manufacturer: {
        type: String,
        required: true,
        trim: true,
      },
    season: {
        type: String,
        required: true,
        trim: true,
      },
    gender: {
        type: String,
        required: true,
        trim: true,
      },
    price: {
        type: Number,
        required: true,
        trim: true,
      }
});

const cartModel = mongoose.model('cartModel', cart);

export default cartModel;