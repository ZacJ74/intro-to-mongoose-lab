const mongoose = require('mongoose');

// Define the schema
const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true}
});

// model
const Customer = mongoose.model('Customer', customerSchema);

// export the model
module.exports = Customer;