'use strict';

module.exports = function(dependencies, lib) {
  const filestore = dependencies('filestore');
  const utils = require('./utils')(dependencies, lib);
  const fs = require('fs');
  const path = require('path');
  const ObjectId = require('mongoose').Types.ObjectId;
  const moment = require('moment');

  return {
    newFile: newFile,
    existingFile: existingFile,
    getMetaDataByUserId: getMetaDataByUserId,
    removeFile: removeFile
  };

  // Cette fonction doit maintenant servir lors de la creation d'un nouveaux document
  function newFile(req, res) {
    //TODO create a new file in mongodb via filestore
    //TODO After link the file with the user who sent the request
    var extension = path.extname(req.body.name);
    var readStream = fs.createReadStream(path.normalize(__dirname + '/sampleFile/sample' + extension));
    var fileId = new ObjectId();
    var options = {};
    var metadata = {};

    if (req.body.name) {
      options.filename = req.body.name;
    }
    else {
      options.filename = moment().format('MMMM Do YYYY, h:mm:ss');
    }

    if (req.user) {
      metadata.creator = {objectType: 'user', id: req.user._id};
    }

     filestore.store(fileId, req.body.mimetype, metadata, readStream, options, function(err, saved) {
       if (err) {
         res.status(500).json({
           error: {
             code: 500,
             message: 'Error when saving file',
             detail: err
           }
         });
       }

       res.status(201).json({_id: saved._id});
     });
  };


  function existingFile(req, res) {

    var options = {};
    //TODO link the file with the user who sent the request
    filestore.get(req.params.fileId, function(err, fileMeta, readStream) {
      if (err) {
        res.status(500).json({
          error: {
            code: 500,
            message: 'Error when retrieving file',
            detail: err
          }
        });
      }

      readStream.on('data', function(fileBuffer) {
        if (options.data) {
          options.data = Buffer.concat([options.data, fileBuffer]);
        } else {
          options.data = fileBuffer;
        }
      });

      readStream.on('end', function() {
        options.data = options.data.toString('base64');
        options.source = fileMeta.filename.split(".").pop();
        options.destination = utils.destinationFromSourceExt(options.source);
        lib.convertion.convertionWithCloudoo(options, function(err, result) {
          if(err) {
            res.status(500).json({
              error: {
                code: 500,
                message: 'Error when converting document',
                detail: err.error
              }
            });
          }
          var decodedFile = Buffer.from(result, 'base64');
          res.writeHead(200);
          res.end(decodedFile);
        });
      });

    });
  }

  function getMetaDataByUserId(req, res) {
    var documentMeta = [];
    filestore.getAllMetaByUserId(req.user._id, req.query, function(err, metas) {
      if(err) {
        res.status(500).json({
          error: {
            code: 500,
            message: 'Error when retrieving metadata',
            detail: err
          }
        });
      }
      metas.map(function(meta) {
        if (utils.fileIsEditorDocument(meta.contentType)) {
          return documentMeta.push(meta);
        }
      });

      res.status(200).json(documentMeta);
    });
  }

  function removeFile(req, res) {
    filestore.delete(req.params.fileId, function(err) {
      if(err) {
        res.status(500).json({
          error: {
            code: 500,
            message: 'Error when deleting document',
            detail: err
          }
        });
      }
      res.status(204).end();
    })
  }

}
