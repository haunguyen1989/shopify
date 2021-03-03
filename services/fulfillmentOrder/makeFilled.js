const { getFulfilledOrders } = require('../lib/fulfillmentOrder');
const { createFulfillment } = require('../lib/fulfillment');
const { createOrder } = require('../lib/ninjavan');
const makeFilled = async (payload) => {

    const orderId = 'gid://shopify/Order/' + payload.order_id;
    const fulfillmentOrder = await getFulfilledOrders(orderId);
    const listFulfillOrder = fulfillmentOrder.order.fulfillmentOrders.edges[0];

    listFulfillOrder.forEach(item => async () => {
        let payloadItem = {};
        payloadItem.service_type = "Parcel";
        payloadItem.service_level = fulfillmentOrder.order.shippingLine.code;
        payloadItem.from = item.node.assignedLocation;
        payloadItem.to = fulfillmentOrder.order.shippingAddress;
        const responseCreateOrder = await createOrder(payloadItem);
        if(!responseCreateOrder.error) {
            const trackingNumber = responseCreateOrder.tracking_number;
            const trackingURL = "https://www.ninjavan.co/?num=" + trackingNumber;
            const dataCreateFulfillment = buildDataCreateFulfillmentOrder(item.node.id, trackingNumber, trackingURL);
            return await createFulfillment(dataCreateFulfillment);
        }
        else {
            console.log(responseCreateOrder.error);
        }
    });
};

const buildDataCreateFulfillmentOrder = (fulfillmentOrderId, trackingNumber, trackingUrl) => {
    return {
        trackingInfo: {
            number: trackingNumber,
            url: trackingUrl
        },
        notifyCustomer: true,
        lineItemsByFulfillmentOrder: {
            fulfillmentOrderId: fulfillmentOrderId
        }
    };
};

module.exports = makeFilled;