const { GET_FULFILLMENT_ORDER } = require('../../queries/schema');

const createFulfillment = async (payload) => {
    const query = GET_FULFILLMENT_ORDER;
    let lineItemsByFulfillmentOrder = [];


    const variables = {
        fulfillment: {
            trackingInfo: {
                number: "223424253"
            },
            notifyCustomer: true,
            lineItemsByFulfillmentOrder:
                [
                    {
                        fulfillmentOrderId: "gid://shopify/FulfillmentOrder/4360542224561",
                        fulfillmentOrderLineItems: [
                            {
                                id: "gid://shopify/FulfillmentOrderLineItem/8192956367025",
                                quantity: 1
                            }
                        ]
                    }
                ]
        }
    };
    return await shopify.graphql(query, variables).catch((err) => console.error(err));
};

module.exports = createFulfillment;