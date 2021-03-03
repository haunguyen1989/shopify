const { dbConnect } = require('../../utils');
const { ShopModel } = require('../../models');

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
            //await ShopModel.deleteOne({ _id: exist.id });
            //const shop = await ShopModel.create(payload);
            return false;
        }
        else {
            return await ShopModel.create(payload);
        }
    } catch (error) {
        console.log(error);
    }
    return false;
};
const deleteShop = async (domain) => {
    try {
        const exist = await ShopModel.findOne({ domain: domain });
        if(exist && exist.id) {
            await ShopModel.deleteOne({ _id: exist.id });
            return true;
        }
        return  false;
    } catch (error) {
        console.log(error);
    }
    return false;
};
module.exports = {
    createShop,
    deleteShop
};