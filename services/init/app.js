const { shop } = require('../../services/shops');
const { addConfig } = require('../../services/configs');

const initialize = async (domain, accessToken) => {
    const store = await shop.createShop({ domain: domain });

    if(store) {
        const success = await addConfig(
            {
                shop_id: store.id,
                path: 'access_token',
                value: accessToken
            }
        );
    }

};
module.exports = initialize;