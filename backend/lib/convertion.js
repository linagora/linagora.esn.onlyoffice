'use strict';

module.exports = function() {
  const xmlrpc = require('xmlrpc');

  function convertionWithCloudoo(options, callback) {
    const client = xmlrpc.createSecureClient({host: 'cloudooo.erp5.net', port: '443', path: '/'});

    client.methodCall('convertFile',
        [options.data,
         options.source || 'docx',
         options.destination || 'docy',
         options.zip || false,
         options.refresh || false,
         options.conversion_kw || {}],
        callback);
  }

  return {
    convertionWithCloudoo: convertionWithCloudoo
  };
};
