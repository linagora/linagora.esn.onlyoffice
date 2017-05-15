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
    addCoAuthor: addCoAuthor,
    importFile: importFile
  };

  function convertion(options, callback) {
    lib.convertion.convertionWithCloudoo(options, function(err, result) {
      if (err) {
        return callback(err, null);
      }

      options.source = options.destination;
      options.data = result;

      if (options.toOnlyOfficeFormat) {
        options.destination = utils.destinationFromSourceExt(options.source);
        if(options.destination) {
          options.toOnlyOfficeFormat = false;
          convertion(options, callback);
        } else {
          callback(null, result);
        }
      } else if (options.toOpenDocument) {
        options.destination = utils.officeToOpenDocument(options.source);
        options.toOpenDocument = false;
        convertion(options, callback);
      } else {
        return callback(null, result);
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
         return res.status(500).json({
           error: {
             code: 500,
             message: 'Error when saving file',
             detail: err
           }
         });
       }

       lib.document.UpdateOrCreate([req.user._id], fileId, function (err, doc) {
         if (err) {
           return res.status(500).json({
             error: {
               code: 500,
               message: 'Error when saving file',
               detail: err
             }
           });
         }

         return res.status(201).json({_id: saved._id});
       });
     });
  };


  function existingFile(req, res) {
    var options = {};
    var decodedFile;
    //TODO link the file with the user who sent the request
    filestore.get(req.params.fileId, function(err, fileMeta, readStream) {
      if (err) {
        return res.status(500).json({
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
        options.toOnlyOfficeFormat = true;
        if (req.query.destination) {
          options.toOnlyOfficeFormat = false;
          options.destination = req.query.destination
        } else {
          options.destination = utils.destinationFromSourceExt(options.source);
        }

        convertion(options, function (err, result) {
          if(err) {
            return res.status(500).json({
              error: {
                code: 500,
                message: 'Error when converting document',
                detail: err.error
              }
            });
          }

          decodedFile = Buffer.from(result, 'base64');

          return res.status(200).end(decodedFile);
        });
      });
    });
  }

  function getMetaDataByUserId(req, res) {
    lib.document.getDocumentsByUserID(req.user._id, function(err, doc) {
      if(err) {
        return res.status(500).json({
          error: {
            code: 500,
            message: 'Error when retrieving metadata',
            detail: err
          }
        });
      }

      if (doc.length === 0) {
        return res.status(200).json([]);
      }

      return res.status(200).json(doc[0].documents);
    });
  }

  function removeFile(req, res) {
    filestore.delete(req.params.fileId, function(err) {
      if(err) {
        return res.status(500).json({
          error: {
            code: 500,
            message: 'Error when deleting document',
            detail: err
          }
        });
      }

      lib.document.remove(req.params.fileId, function(err) {
        if(err) {
          return res.status(500).json({
            error: {
              code: 500,
              message: 'Error when deleting document',
              detail: err
            }
          });
        }
        return res.status(204).end();
      });
    });
  }

  function saveModif(req, res) {
    var options = {};
    var defaultExt = ['docx', 'xlsx', 'pptx'];
    var fileExt = req.params.extFile;
    var fileOptions = {};
    var fileStream = stream.PassThrough();

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
          return res.status(500).json({
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
          options.destination = utils.opentDocumentToOffice(options.destination)
          options.toOpenDocument = true;
        }

        convertion(options, function (err, result) {
          filestore.delete(req.params.fileId, function(err) {
            if(err) {
              return res.status(500).json({
                error: {
                  code: 500,
                  message: 'Error when deleting document',
                  detail: err
                }
              });
            }

            fileOptions.filename = fileMeta.filename;

            fileStream.end(Buffer.from(result, 'base64'));

            filestore.store(req.params.fileId, fileMeta.contentType, fileMeta.metadata, fileStream, fileOptions, function(err, saved) {
              if(err) {
                return res.status(500).json({
                  error: {
                    code: 500,
                    message: 'Error when saving document modification',
                    detail: err
                  }
                });
              }

              return res.status(204).end();
            });
          });
        });
      });
    });
  }

  function addCoAuthor(req, res) {
    var usersEmail = [],
        usersID = [];

    usersID = _.map(req.body, function (user) {
      usersEmail.push(user.preferredEmail);
      return new ObjectId(user._id);
    });

    lib.document.UpdateOrCreate(usersID, req.params.fileId, function (err, result) {
      if (err) {
        return res.status(500).json({
          error: {
            code: 500,
            message: 'Error when saving document coAuthor',
            detail: err
          }
        });
      }

      result.document = result.document.toObject();

      var FileExtension = result.document.filename.split(".").pop();
      emailSender.sendEmail({
        data: {
          email: usersEmail,
          userSender: req.user,
          fileExt: FileExtension,
          fileShared: result.document,
          fileUrl: url.format({
                    protocol: req.protocol,
                    host: req.get('host'),
                    hash: '#/onlyoffice/editor/'+ FileExtension + '/' + req.params.fileId
                  })
        }
      }, function (err, ok) {
        if (err) {
          return res.status(500).json({
            error: {
              code: 500,
              message: 'Error when sending mail',
              detail: err
            }
          });
        }

        return res.status(200).json(result);
      });
    });
  }

  function importFile(req, res) {
    var file = '';
    var fileId = new ObjectId();
    var options = {};
    var metadata = {};
    var fileStream = stream.PassThrough();
    var mimetype;

    req.on('data', function(data) {
      if(file) {
        file = Buffer.concat([file, data])
      } else {
        file = data;
      }
    });

    req.on('end', function() {
      fileStream.end(file);

      if (req.params.filename) {
        options.filename = req.params.filename;
      }
      else {
        options.filename = moment().format('MMMM Do YYYY, h:mm:ss');
      }

      if (req.user) {
        metadata.creator = {objectType: 'user', id: req.user._id};
      }

      mimetype = 'application/' + req.params.mimetype;

      filestore.store(fileId, mimetype, metadata, fileStream, options, function(err, saved) {
        if (err) {
          return res.status(500).json({
            error: {
              code: 500,
              message: 'Error when saving file',
              detail: err
            }
          });
        }

        lib.document.UpdateOrCreate([req.user._id], fileId, function (err, doc) {
          if (err) {
            return res.status(500).json({
              error: {
                code: 500,
                message: 'Error when saving file',
                detail: err
              }
            });
          }

          return res.status(201).json(saved);
        });
      });
    });
  }

}
