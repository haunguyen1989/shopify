

const { dbConnect } = require('../../utils');
const { ConfigModel } = require('../../models');


dbConnect();

const addConfig = async (payload) => {
    try {
        return await ConfigModel.create(payload);
    } catch (error) {
        console.log(error);
    }
    return false;
};

module.exports = addConfig;