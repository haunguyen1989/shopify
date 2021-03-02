

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

            const config = await ConfigModel.create({
                shop_id: shop.id,
                client_id: 'skgihsfhslfhsdlfs',
                client_secret: 'skgislfjsdlfsdlfslfhsfh'
            });
        }


        return config;
    } catch (error) {
        console.log(error);
    }
    return false;
};

module.exports = createShop;