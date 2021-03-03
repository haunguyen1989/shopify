const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
    shop_id: {
        type: String,
        ref: 'Shop'
    },
    path: {
        type: String
    },
    value: {
        type: String
    }
}, {
    collection: 'configs'
});

const ConfigModel = mongoose.models.Config || mongoose.model('Config', ConfigSchema);
module.exports = ConfigModel;

/*
console.log('HELLO1');
ConfigModel.find({
    client_id: 'skgihsfhslfhsdlfs'
})
    .populate('shop_id')
    .then(data => {
    console.log(data);
}).catch(error => {
    console.log(error);
});*/
