'use strict';

module.exports = function(dependencies, lib) {
  const filestore = dependencies('filestore');
  const emailSender = require('./emailSender').sharedDocument(dependencies, lib);
  const utils = require('./utils')(dependencies, lib);
  const fs = require('fs');
  const path = require('path');
  const stream = require('stream');
  const ObjectId = require('mongoose').Types.ObjectId;
  const moment = require('moment');
  const _ = require('lodash');
  const url = require('url');

  return {
    newFile: newFile,
    existingFile: existingFile,
    getMetaDataByUserId: getMetaDataByUserId,
    removeFile: removeFile,
    saveModif: saveModif,
    addCoAuthor: addCoAuthor
  };

  function convertion(options, callback) {
    lib.convertion.convertionWithCloudoo(options, function(err, result) {
      if (err) {
        callback(err, null);
      }
      options.source = options.destination;
      options.destination = utils.destinationFromSourceExt(options.source);

      if (options.destination) {
        options.data = result;
        convertion(options, callback);
      } else {
        callback(null, result);
      }
    });
  }

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
    var decodedFile;
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
        if (req.query.destination) {
          options.destination = req.query.destination
        } else {
          options.destination = utils.destinationFromSourceExt(options.source);
        }

        convertion(options, function (err, result) {
          if(err) {
            res.status(500).json({
              error: {
                code: 500,
                message: 'Error when converting document',
                detail: err.error
              }
            });
          }
          decodedFile = Buffer.from(result, 'base64');
          res.writeHead(200);
          res.end(decodedFile);
        })
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

  function saveModif(req, res) {
    var options = {};
    var defaultExt = ['docx', 'xlsx', 'pptx'];
    var fileExt = req.params.extFile;

    req.on('data', function(data) {
      if(options.data) {
        options.data = Buffer.concat([options.data, data])
      } else {
        options.data = data;
      }
    });

    req.on('end', function() {
      filestore.getMeta(req.params.fileId, function(err, fileMeta) {
        if(err) {
          res.status(500).json({
            error: {
              code: 500,
              message: 'Error when retrieving document\'s metadata',
              detail: err
            }
          });
        }

        options.data = options.data.toString('base64');
        options.source = utils.sourceToDestination(req.params.extFile)
        options.destination = req.params.extFile;

        if (!defaultExt.includes(options.destination)) {
          console.log("Not open doc");
          console.log(options.destination);
          options.destination = utils.opentDocumentToOffice(options.destination)
          lib.convertion.convertionWithCloudoo(options, function(err, result) {
            if (err) {
              res.status(500).json({
                error: {
                  code: 500,
                  message: 'Error when converting document',
                  detail: err.error
                }
              });
            }
            options.data = result;
            options.source = options.destination;
            options.destination = req.params.extFile;
          });
        }

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

            var fileOptions = {}
            fileOptions.filename = fileMeta.filename;

            var fileStream = stream.PassThrough();
            fileStream.end(Buffer.from(result, 'base64'));

            filestore.store(req.params.fileId, fileMeta.contentType, fileMeta.metadata, fileStream, fileOptions, function(err, saved) {
              if(err) {
                res.status(500).json({
                  error: {
                    code: 500,
                    message: 'Error when saving document modification',
                    detail: err
                  }
                });
              }
              res.status(204).end();
            });
          });
        });
      });
    });
  }

  function addCoAuthor(req, res) {
    var query = {
      metadata: {
        coAuthor: []
      }
    };

    var usersEmail = [];

    query.metadata.coAuthor = _.map(req.body, function (user) {
      usersEmail.push(user.preferredEmail);
      return new ObjectId(user._id);
    });

    filestore.addMeta(req.params.fileId, query, function (err, result) {
      if (err) {
        res.status(500).json({
          error: {
            code: 500,
            message: 'Error when saving document coAuthor',
            detail: err
          }
        });
      }

      var FileExtension = result.value.filename.split(".").pop();
      emailSender.sendEmail({
        data: {
          email: usersEmail,
          userSender: req.user,
          fileExt: FileExtension,
          fileShared: result.value,
          fileUrl: url.format({
                    protocol: req.protocol,
                    host: req.get('host'),
                    hash: '#/onlyoffice/editor/'+ FileExtension + '/' + req.params.fileId
                  })
        }
      }, function (err, ok) {
        if (err) {
          res.status(500).json({
            error: {
              code: 500,
              message: 'Error when sending mail',
              detail: err
            }
          });
        }
        res.status(200).json(result);
      });
    });
  }

}
