const Hapi = require('@hapi/hapi');
const Bell = require('@hapi/bell');

const validateFunc = async (decoded) => {
  return {
    isValid: true,
    credentials: decoded,
  };
};

module.exports = async (serverOptions, options) => {
  const server = Hapi.server(
    Object.assign({
      port: 3001,
      host: 'localhost',
      routes: {
        cors: {
          origin: ['*'],
        },
      },
    }, serverOptions),
  );

  // Redirect to SSL
  if (options.enableSSL) {
    console.log('Setting SSL');
    await server.register({plugin: require('hapi-require-https')});
  } else {
    console.log('Not setting SSL');
  }

  await server.register([
    require('vision'),
    require('inert'),
    {
      plugin: require('lout'),
      options: {
        endpoint: '/docs',
      },
    },
    {
      plugin: require('good'),
      options: {
        ops: {
          interval: 1000,
        },
        reporters: {
          consoleReporter: [
            {
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [{response: '*'}],
            },
            {
              module: 'good-console',
            },
            'stdout',
          ],
        },
      },
    },
  ]);
  server.route(require('./routes.js'));

  return server;
};