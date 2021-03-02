const { GET_UNFULFILLED_ORDER_FROM_ASSIGNED } = require('../../queries/schema');

const getAssignFulfillmentOrder = async (cursor) => {
    const query = GET_UNFULFILLED_ORDER_FROM_ASSIGNED;
    const variables = {
        "after": cursor
    };
    return await shopify.graphql(query, variables).catch((err) => console.error(err));
};

const hasSupportRequestFulfill = (supportedActions) => {
    let has = false;
    if(supportedActions.length) {
        supportedActions.forEach(supportedAction => {
            if(supportedAction.action === 'REQUEST_FULFILLMENT') {
                has = true;
            }
        });
    }
    return has;
};

const getUnFulfilledFromAssignedOrder = async () => {
    let cursor = null;
    let end = false;
    let listUnSubmit = [];

    while (!end) {
        let res = await getAssignFulfillmentOrder(cursor);
        let edges = res.shop.assignedFulfillmentOrders.edges;
        if(edges.length === 0) {
            end = true;
            break;
        }
        edges.forEach(fulfillment => {
            let supportRequest = hasSupportRequestFulfill(fulfillment.node.supportedActions);
            if(fulfillment.node.requestStatus === 'UNSUBMITTED' && fulfillment.node.status === 'OPEN' && supportRequest) {
                listUnSubmit.push(fulfillment);
            }
            cursor = fulfillment.cursor;
        });
    }

    return listUnSubmit;
};


module.exports = getUnFulfilledFromAssignedOrder;