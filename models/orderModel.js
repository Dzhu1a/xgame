import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    login: { type: String, required: true },
    status: { type: String, required: true },
    date: { type: Date, default: Date.now },
    items: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    totalSum: { type: Number, required: true }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;