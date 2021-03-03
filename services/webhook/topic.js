const { makeFilled } = require('../fulfillmentOrder');
const { uninstaller } = require('../uninstall');

const process = async (topic, payload) => {
    switch (topic) {
        case 'ORDERS_CREATE':
            await makeFilled(payload);
            break;
        case 'FULFILLMENTS_CREATE':
            await requestTracking(payload);
            break;
        case 'APP_UNINSTALLED':
            await uninstaller(payload.domain);
            break;

    }
};

module.exports = process;