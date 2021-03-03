const { CANCEL_FULFILLMENT_ASSOCIATED } = require('../../queries/schema');

const cancelFulfillment = async (ID) => {
    const query = CANCEL_FULFILLMENT_ASSOCIATED;
    const variables = {
        "id": ID
    };
    const res = await shopify.graphql(query, variables).catch((err) => console.error(err));
    if(res.fulfillmentCancel.userErrors.length > 0) {
        console.error(res.fulfillmentCancel.userErrors);
        return false;
    }
    return res;
};

module.exports = cancelFulfillment;