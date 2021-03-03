const mongoose = require('mongoose');


const ShopSchema = new mongoose.Schema({
    domain: {
        type: String,
        required: [true, 'Please add a domain'],
        unique: true,
        maxlength: [255, 'Domain cannot be more than 255 characters']
    }
}, {
    collection: 'shops'
});

ShopSchema.pre('deleteOne', { query: true, document: false }, async function(next) {
    const { ConfigModel } = require('../models');

    console.log('Removing!' + this.getQuery()._id);
    const shop_id = this.getQuery()._id;
    try {
        await ConfigModel.deleteMany({
            "shop_id": {
                $in: [shop_id]
            }
        });

        next();
    } catch (error) {
        next(error);
    }
});
const ShopModel = mongoose.models.Shop || mongoose.model('Shop', ShopSchema);

module.exports = ShopModel;