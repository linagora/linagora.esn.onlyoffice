'use strict'

module.exports = function(dependencies) {
  const xmlrpc = require('xmlrpc');


  return {
    convertionWithCloudoo: convertionWithCloudoo
  };

  function convertionWithCloudoo(options, callback) {
    let client = xmlrpc.createSecureClient({host: 'cloudooo.erp5.net', port:'443', path: '/'})

    client.methodCall('convertFile',
        [options.data,
         options.source || 'docx',
         options.destination || 'docy',
         options.zip || false,
         options.refresh || false,
         options.conversion_kw || {}],
        callback)
  }
}
