const { RETRIEVES_FULFILLMENT_ASSOCIATED } = require('../../queries/schema');

const retrievesFulfillmentAssociated = async (ID) => {
    const query = RETRIEVES_FULFILLMENT_ASSOCIATED;
    const variables = {
        "id": ID
    };
    const res = await shopify.graphql(query, variables).catch((err) => console.error(err));
    if(res.order.fulfillments) {
        return  res.order.fulfillments[0].id;
    }
    return false;
};

module.exports = retrievesFulfillmentAssociated;