const { getFulfilledOrders } = require('../lib/fulfillmentOrder');
const { sendRequestFulfillment } = require('../lib/fulfillmentRequest');
const { retrievesFulfillmentAssociated, cancelFulfillment, createFulfillment } = require('../lib/fulfillment');
const requestTracking = async (payload) => {
    const orderId = payload.admin_graphql_api_id;
    const fulfillmentOrder = await getFulfilledOrders(orderId);
    if(fulfillmentOrder) {
        const originalFulfillmentOrderId = fulfillmentOrder.order.fulfillmentOrders.edges[0].node.id;
        let resRequestFulfill = await sendRequestFulfillment(originalFulfillmentOrderId);

        if(resRequestFulfill) {
            const fulfillmentId = await retrievesFulfillmentAssociated(orderId);
            if(fulfillmentId) {
                await cancelFulfillment(fulfillmentId);

                const trackingNumber = '223543252';
                const trackingURL = "https://shipping.xyz/track.php?num=223543252";
                const dataCreateFulfillment = buildDataCreateFulfillment(fulfillmentOrder.order.fulfillmentOrders.edges[0].node.id, fulfillmentOrder.order.fulfillmentOrders.edges[0].node.lineItems.edges, trackingNumber, trackingURL, true);

                return await createFulfillment(dataCreateFulfillment);
            }
        }
        return false;
    }
};

const buildDataCreateFulfillment = (fulfillmentOrderId, lineItems, trackingNumber, trackingUrl, notifyCustomer) => {
    let fulfillmentLineItemsOrders = [];
    lineItems.forEach(lineItem => {
        fulfillmentLineItemsOrders.push(
            {
                id: lineItem.node.id,
                quantity: lineItem.node.totalQuantity
            }
        );
    });
    return {
        trackingInfo: {
            number: trackingNumber,
            url: trackingUrl
        },
        notifyCustomer: notifyCustomer,
        lineItemsByFulfillmentOrder: {
            fulfillmentOrderId: fulfillmentOrderId,
            fulfillmentOrderLineItems: fulfillmentLineItemsOrders
        }
    };
};
module.exports = requestTracking;