const { shop } = require('../../services/shops');

const uninstaller = async (domain) => {

    await shop.deleteShop(domain);
};
module.exports = uninstaller;