const { GET_FULFILLMENT_ORDERS } = require('../../queries/schema');

const hasSupportRequestFulfill = (supportedActions) => {
    let has = false;
    if(supportedActions.length) {
        supportedActions.forEach(supportedAction => {
            if(supportedAction.action === 'REQUEST_FULFILLMENT' || supportedAction.action === 'EXTERNAL') {
                has = true;
            }
        });
    }
    return has;
};

const getFulfilledOrders = async (originalFulfillmentOrderId) => {
    let fulfillmentOrder =  await shopify.graphql(GET_FULFILLMENT_ORDERS).catch((err) => console.error(err));
    let listUnFulfilled = [];
    if(hasSupportRequestFulfill(fulfillmentOrder.order.fulfillmentOrders.edges[0].node.supportedActions)) {
        listUnFulfilled.push(node);
    }

    return listUnFulfilled;
};

module.exports = getFulfilledOrders;