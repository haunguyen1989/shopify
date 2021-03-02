const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
    domain: {
        type: String,
        required: [true, 'Please add a domain'],
        unique: true,
        maxlength: [255, 'Domain cannot be more than 255 characters']
    }
});
const Store = mongoose.models.Store || mongoose.model('Store', StoreSchema);
module.exports = Store;