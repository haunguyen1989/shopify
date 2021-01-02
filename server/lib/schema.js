const { loadFilesSync } = require('@graphql-tools/load-files');
const loadGraphql=  (pathFile) => {
    return loadFilesSync('./server/queries/' + pathFile)[0];
};

module.exports = {
    GET_FULFILLMENT_ORDER: loadGraphql('retrievesWithOrder.graphql')
};
