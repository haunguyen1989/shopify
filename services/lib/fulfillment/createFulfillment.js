const { CREATE_FULFILLMENT } = require('../../queries/schema');

const createFulfillment = async (payload) => {
    const query = CREATE_FULFILLMENT;

    const variables = {
        fulfillment: payload
    };
    const res = await shopify.graphql(query, variables).catch((err) => console.error(err));
    if(res.fulfillmentCreateV2.userErrors.length > 0) {
        console.log(res.fulfillmentCreateV2.userErrors);
        return false;
    }
    return res.fulfillmentCreateV2;
};

module.exports = createFulfillment;