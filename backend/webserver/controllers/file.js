'use strict';

module.exports = (dependencies, lib) => {
  const filestore = dependencies('filestore');
  const emailSender = require('./emailSender').sharedDocument(dependencies, lib);
  const utils = require('./utils')();
  const fs = require('fs');
  const path = require('path');
  const stream = require('stream');
  const ObjectId = dependencies('db').mongo.mongoose.Types.ObjectId;
  const moment = require('moment');
  const q = require('q');
  const _ = require('lodash');
  const url = require('url');

  return {
    newFile,
    existingFile,
    getMetaDataByUserId,
    removeFile,
    saveModif,
    addCoAuthor,
    importFile
  };

  function convertion(options) {
    return new Promise((resolve, reject) => {
      lib.convertion.convertionWithCloudoo(options)
        .then(result => {
          options.source = options.destination;
          options.data = result;

          if (options.toOnlyOfficeFormat || options.toOpenDocument) {
            options.destination = utils.destinationFromSourceExt(options.source);
            if (options.destination) {
              options.toOnlyOfficeFormat = options.toOpenDocument = false;

              return resolve(convertion(options));
            }
          }

          return resolve(result);
        }).catch(reject);
    });
  }

  function newFile(req, res) {
    const extension = path.extname(req.body.name);
    const readStream = fs.createReadStream(path.normalize(__dirname + '/sampleFile/sample' + extension));
    const fileId = new ObjectId();
    const options = {};
    const metadata = {};

    options.filename = req.body.name || moment().format('MMMM Do YYYY, h:mm:ss');

    if (req.user) {
      metadata.creator = { objectType: 'user', id: req.user._id };
    }

    return q.nfcall(filestore.store, fileId, req.body.mimetype, metadata, readStream, options)
      .then(saved => lib.document.UpdateOrCreate([req.user._id], saved._id))
      .then(doc => res.status(201).json({ _id: doc.document._id }))
      .catch(err => res.status(500).json({
        error: {
          code: 500,
          message: 'Error when saving file',
          detail: err.message
        }
      }));
  }

  function existingFile(req, res) {
    const options = {};

    return q.nfcall(filestore.get, req.params.fileId)
      .then(([fileMeta, readStream]) => new Promise(resolve => {
        readStream.on('data', fileBuffer => {
          options.data ? Buffer.concat([options.data, fileBuffer]) : options.data = fileBuffer;
        });

        readStream.on('end', () => {
          options.data = options.data.toString('base64');
          options.source = fileMeta.filename.split('.').pop();
          options.destination = req.query.destination || utils.destinationFromSourceExt(options.source);
          if (!req.query.destination) {
            options.toOnlyOfficeFormat = true;
          }

          return resolve(options);
        });
      }))
      .then(convertion)
      .then(result => res.status(200).end(Buffer.from(result, 'base64')))
      .catch(err => res.status(500).json({
        error: {
          code: 500,
          message: 'Error when retrieving file',
          detail: err
        }
      }));
  }

  function getMetaDataByUserId(req, res) {
    return lib.document.getDocumentsByUserID(req.user._id, req.query)
      .then(doc => res.status(200).json(doc[0] ? doc[0].documents : []))
      .catch(err => res.status(500).json({
        error: {
          code: 500,
          message: 'Error when retrieving document',
          detail: err
        }
      }));
  }

  function removeFile(req, res) {
    return q.nfcall(filestore.delete, req.params.fileId)
      .then(lib.document.remove(req.params.fileId))
      .then(() => res.status(204).end())
      .catch(err => res.status(500).json({
        error: {
          code: 500,
          message: 'Error when deleting document',
          detail: err
        }
      }));
  }

  function saveModif(req, res) {
    const options = {}, fileOptions = {}, file = {}, fileStream = stream.PassThrough();

    req.on('data', data => {
      options.data = options.data ? Buffer.concat([options.data, data]) : options.data = data;
    });

    return req.on('end', () => {
      q.nfcall(filestore.getMeta, req.params.fileId)
        .then(fileMeta => new Promise(resolve => {
          options.data = options.data.toString('base64');
          options.source = utils.sourceToDestination(req.params.extFile);
          options.toOpenDocument = !utils.isOfficeDocument(req.params.extFile);
          options.destination = !options.toOpenDocument ? req.params.extFile : utils.destinationFromSourceExt(req.params.extFile);
          file.fileMeta = fileMeta;
          fileOptions.filename = file.fileMeta.filename;

          return resolve(options);
        }))
        .then(convertion)
        .then(result => {
          fileStream.end(Buffer.from(result, 'base64'));

          return q.nfcall(filestore.delete, req.params.fileId);
        })
        .then(() => q.nfcall(filestore.store, req.params.fileId, file.fileMeta.contentType, file.fileMeta.metadata, fileStream, fileOptions))
        .then(res.status(204).end())
        .catch(err => res.status(500).json({
          error: {
            code: 500,
            message: 'Error when saving document coAuthor',
            detail: err
          }
        }));
    });
  }

  function addCoAuthor(req, res) {
    const usersEmail = [];
    let usersID = [];

    usersID = _.map(req.body, user => {
      usersEmail.push(user.preferredEmail);

      return new ObjectId(user._id);
    });

    return lib.document.UpdateOrCreate(usersID, req.params.fileId)
      .then(result => {
        const fileExtension = result.document.filename.split('.').pop();

        return emailSender.sendEmail({
          data: {
            email: usersEmail,
            userSender: req.user,
            fileExt: fileExtension,
            fileShared: result.document,
            fileUrl: url.format({
              protocol: req.protocol,
              host: req.get('host'),
              hash: '#/onlyoffice/editor/' + fileExtension + '/' + req.params.fileId
            })
          }
        });
      })
      .then(res.status(200).json())
      .catch(err => res.status(500).json({
        error: {
          code: 500,
          message: 'Error when adding a coAuthor',
          detail: err
        }
      }));
  }

  function importFile(req, res) {
    let file = '';
    const fileId = new ObjectId();
    const options = {};
    const metadata = {};
    const fileStream = stream.PassThrough();
    const mimetype = `application/${req.params.mimetype}`;

    req.on('data', data => {
      file = file ? Buffer.concat([file, data]) : file = data;
    });

    req.on('end', () => {
      fileStream.end(file);
      options.filename = req.params.filename || moment().format('MMMM Do YYYY, h:mm:ss');

      if (req.user) {
        metadata.creator = { objectType: 'user', id: req.user._id };
      }

      return q.nfcall(filestore.store, fileId, mimetype, metadata, fileStream, options)
        .then(lib.document.UpdateOrCreate([req.user._id], fileId))
        .then(result => res.status(201).json(result));
    });
  }
};
