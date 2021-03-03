const { GET_FULFILLMENT_ORDERS } = require('../../queries/schema');

const getFulfilledOrders = async (ID) => {
    const variables = {
        "id": ID
    };
    return await shopify.graphql(GET_FULFILLMENT_ORDERS, variables).catch((err) => console.error(err));
};

module.exports = getFulfilledOrders;