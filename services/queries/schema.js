const { loadFilesSync } = require('@graphql-tools/load-files');
const path = require('path');
const loadGraphqlFile=  (pathFile) => {
    return loadFilesSync(path.join(__dirname, `/${pathFile}`))[0];
};

module.exports = {
    RETRIEVES_FULFILLMENT_ASSOCIATED: loadGraphqlFile('retrievesFulfillmentAssociated.graphql'),
    CANCEL_FULFILLMENT_ASSOCIATED: loadGraphqlFile('cancelFulfillment.graphql'),
    CREATE_FULFILLMENT: loadGraphqlFile('createFulfillment.graphql'),
    GET_FULFILLMENT_ORDERS: loadGraphqlFile('fulfillmentOrders.graphql'),
    GET_UNFULFILLED_ORDER_FROM_ASSIGNED: loadGraphqlFile('orderUnfulfilledFromAssignedFulfillment.graphql'),
    SEND_REQUEST_FULFILLMENT: loadGraphqlFile('sendRequestFulfillment.graphql')
};
