const { createShop } = require('../../services/stores');
const { addConfig } = require('../../services/configs');
const initialize = async (domain, accessToken) => {

    const shop = await createShop({ domain: domain });
    const success = await addConfig(
        {
            shop_id: shop.id,
            path: 'access_token',
            value: accessToken
        }
        );
};
module.exports = initialize;