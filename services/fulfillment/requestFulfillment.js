const { getFulfilledOrders } = require('../lib/fulfillmentOrder');
const { sendRequestFulfillment } = require('../lib/fulfillmentRequest');

const hasSupportRequestFulfill = (node) => {
    let has = false;
    if(node.supportedActions.length) {
        node.supportedActions.forEach(supportedAction => {
            if(supportedAction.action === 'REQUEST_FULFILLMENT' || supportedAction.action === 'EXTERNAL') {
                has = true;
            }
        });
    }
    return node.requestStatus === 'UNSUBMITTED' && has;
};

const requestFulfillment = async (payload) => {
    const orderId = payload.admin_graphql_api_id;
    const fulfillmentOrder = await getFulfilledOrders(orderId);
    if(hasSupportRequestFulfill(fulfillmentOrder.order.fulfillmentOrders.edges[0].node)) {
        const originalFulfillmentOrderId = fulfillmentOrder.order.fulfillmentOrders.edges[0].node.id;
        return await sendRequestFulfillment(originalFulfillmentOrderId);
    }
    return false;
};

module.exports = requestFulfillment;