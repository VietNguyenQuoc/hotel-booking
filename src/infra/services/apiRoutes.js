const redisClient = require('../db/redis');

const bulkCreateApiReferences = data => {

}

const getAllApiReferences = async () => {

}

function createPermissionName(method, resource) {
  return `${method}${resource.replace(/\//g, ' ')}`.replace(/(\w)(\w*)/g,
    function (g0, g1, g2) { return g1.toUpperCase() + g2.toLowerCase(); }).replace(/\s/g, '');
}

module.exports = {
  getAllApiReferences,
  bulkCreateApiReferences
}