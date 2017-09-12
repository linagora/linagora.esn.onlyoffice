'use strict';

module.exports = () => {
  const xmlrpc = require('xmlrpc');

  return {
    convertionWithCloudoo
  };

  function convertionWithCloudoo(options) {
    const client = xmlrpc.createSecureClient({ host: 'cloudooo.erp5.net', port: '443', path: '/' });

    return new Promise((resolve, reject) => {
      client.methodCall('convertFile',
        [options.data,
        options.source || 'docx',
        options.destination || 'docy',
        options.zip || false,
        options.refresh || false,
        options.conversion_kw || {}],
        (err, value) => (err ? reject(err) : resolve(value)));
    });
  }
};
