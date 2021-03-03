const { SEND_REQUEST_FULFILLMENT } = require('../../queries/schema');

const sendRequestFulfillment = async (ID) => {
    const query = SEND_REQUEST_FULFILLMENT;
    const variables = {
        "id": ID
    };
    const res = await shopify.graphql(query, variables).catch((err) => console.error(err));
    if(res.fulfillmentOrderSubmitFulfillmentRequest.userErrors.length > 0) {
        console.error(res.fulfillmentOrderSubmitFulfillmentRequest.userErrors);
        return false;
    }
    return res;
};

module.exports = sendRequestFulfillment;