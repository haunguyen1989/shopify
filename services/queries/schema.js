const { loadFilesSync } = require('@graphql-tools/load-files');
const loadGraphql=  (pathFile) => {
    return loadFilesSync('./services/queries/' + pathFile)[0];
};

module.exports = {
    GET_FULFILLMENT_ORDER: loadGraphql('retrievesWithOrder.graphql'),
    GET_FULFILLMENT_ASSIGNED_ORDER: loadGraphql('getFulfillmentAssignedOrder.graphql'),
    GET_FULFILLMENT_ASSIGNED_ORDER: loadGraphql('getFulfillmentAssignedOrder.graphql')
};
