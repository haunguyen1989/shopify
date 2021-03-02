const { getFulfilledOrders } = require('../lib/fulfillmentOrder');
const { cancelFulfillment, createFulfillment } = require('../lib/fulfillment');
const { createOrder } = require('../lib/ninjavan');
const requestTracking = async (payload) => {

    const orderId = 'gid://shopify/Order/' + payload.order_id;
    const fulfillmentOrder = await getFulfilledOrders(orderId);

    const fulfillmentId = payload.admin_graphql_api_id;
    await cancelFulfillment(fulfillmentId);

    payload.service_type = "Parcel";
    payload.service_level = fulfillmentOrder.order.shippingLine.code;
    payload.from = fulfillmentOrder.order.shippingAddress;
    payload.to = fulfillmentOrder.order.shippingAddress;
    const responseCreateOrder = await createOrder(payload);
    if(!responseCreateOrder.error) {
        const trackingNumber = responseCreateOrder.tracking_number;
        const trackingURL = "https://www.ninjavan.co/?num=" + trackingNumber;
        const dataCreateFulfillment = buildDataCreateFulfillment(fulfillmentOrder.order.fulfillmentOrders.edges[0].node.id, fulfillmentOrder.order.fulfillmentOrders.edges[0].node.lineItems.edges, trackingNumber, trackingURL, true);
        return await createFulfillment(dataCreateFulfillment);
    }
    else {
        console.log(responseCreateOrder.error);
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