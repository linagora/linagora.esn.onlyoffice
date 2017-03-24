'use strict';

module.exports = function(dependencies, lib) {
  const logger = dependencies('logger');
  const Busboy = require('busboy');
  const filestore = dependencies('filestore');

  return {
    convertion: convertion,
    convertionFile: convertionFile
  };

  // Cette fonction doit maintenant servir lors de la creation d'un nouveaux document
  function convertion(req, res) {
    let options = {};

    if (req.method === 'POST') {
      var busboy = new Busboy({ headers: req.headers });
      busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {;
        file.on('data', function(data) {
          if (options.data) {
            options.data = Buffer.concat([options.data, data])
          } else {
            options.data = data;
          }
        });
      });
      busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        if(fieldname === 'source_format') {
          options.source = val;
        } else if (fieldname === 'destination_format') {
          options.destination = val
        }
      });
      busboy.on('finish', function() {
        if(options.data) {
          options.data = options.data.toString('base64');
          lib.convertion.convertionWithCloudoo(options, function(err, result) {
            if(err) {
              res.status(500).json({
                error: {
                  code: 500,
                  message: 'Error when converting document',
                  detail: err
                }
              });
            } else {
              var decodedFile = Buffer.from(result, 'base64')
              res.writeHead(200)
              res.end(decodedFile);
            }
          });
        } else {
          res.writeHead(200)
          res.end();
        }
      });
      req.pipe(busboy);
    }
  };


  function convertionFile(req, res) {

    /*filestore.get(req.params.fileId, function(err, fileMeta, readStream) {
      readStream.on('data', (chunk) => {
        console.log(chunk.toString());
      })
    });*/
  };
}
