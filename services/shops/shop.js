

const { dbConnect } = require('../../utils');
const { ShopModel, ConfigModel } = require('../../models');


dbConnect();

const createShop = async (payload) => {
    try {
        /*const res = await ShopModel.findOneAndDelete( {
            domain: payload.domain
        }, function (err) {
            return !err;

        });*/
        const exist = await ShopModel.findOne({ domain: payload.domain });
        if(exist && exist.id) {
            await ShopModel.deleteOne({ _id: exist.id });
            const shop = await ShopModel.create(payload);
            return shop;
        }
        else {
            const shop = await ShopModel.create(payload);
            return shop;
        }
    } catch (error) {
        console.log(error);
    }
    return false;
};

module.exports = createShop;