// basketModel.js
import mongoose from 'mongoose';

const basketSchema = new mongoose.Schema({
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    login: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Basket = mongoose.model('Basket', basketSchema);

export default Basket;
