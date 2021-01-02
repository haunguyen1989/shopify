const { GET_FULFILLMENT_ORDER } = require('../lib/schema');

const retrievesWithOrder = async (orderGid) => {
    const query = GET_FULFILLMENT_ORDER;
    const variables = {
        "id": orderGid
    };
    return await shopify.graphql(query, variables).catch((err) => console.error(err));
};

module.exports = retrievesWithOrder;