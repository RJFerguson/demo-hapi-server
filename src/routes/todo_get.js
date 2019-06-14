const Joi = require('joi');
const Boom = require('boom');

module.exports = {
  method: 'GET',
  path: '/todo',
  options: {},
  handler: async (request, h) => {
    try {
        return 'Hello World!';
    } catch (e) {
      return Boom.badImplementation(e);
    }
  }
};