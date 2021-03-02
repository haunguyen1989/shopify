const { sendRequestFulfillment } = require('../lib/fulfillmentRequest');

const sendRequestFulfillment = async (originalFulfillmentOrderId) => {
    const query = MAKE_FULFILLMENT_REQUEST;
    const variables = {
        "id": originalFulfillmentOrderId
    };
    return await shopify.graphql(query, variables).catch((err) => console.error(err));
};

module.exports = sendRequestFulfillment;