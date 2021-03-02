const { SEND_REQUEST_FULFILLMENT } = require('../../queries/schema');

const sendRequestFulfillment = async (originalFulfillmentOrderId) => {
    const query = SEND_REQUEST_FULFILLMENT;
    const variables = {
        "id": originalFulfillmentOrderId
    };
    return await shopify.graphql(query, variables).catch((err) => console.error(err));
};

module.exports = sendRequestFulfillment;