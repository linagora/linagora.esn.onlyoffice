'use strict';

module.exports = function(dependencies) {

  const mongoose = dependencies('db').mongo.mongoose;
  const documentModel = mongoose.model('document');
  const CONSTANTS = require('./constants');

  function UpdateOrCreate(usersID, documentID, callback) {
    return documentModel.findOneAndUpdate({document: documentID}, {$set: {document: documentID}, $push: {users: { $each: usersID}}}, {new: true, upsert: true})
      .populate('document').exec(callback);
  }

  function getDocumentsByUserID(userID, options = {}, callback) {
    return documentModel.aggregate([
      { $match: { users: userID } },
      { $lookup: {
          from: 'fs.files', localField: 'document', foreignField: '_id', as: 'documents2'
      }},
      { $project: {
          _id: 1, users: 1, document: { $arrayElemAt: ['$documents2', 0] }
      }},
      { $sort: { 'document.uploadDate': -1 } },
      { $group: {
          _id: userID,
          documents: { $push: '$document' }
      }},
      { $skip: +options.offset || CONSTANTS.DEFAULT_OFFSET },
      { $limit: +options.limit || CONSTANTS.DEFAULT_LIMIT }
    ], callback);
  }



  function remove(documentID, callback) {
    return documentModel.remove({document: documentID}, callback);
  }

  return {
    UpdateOrCreate,
    getDocumentsByUserID,
    remove
  };
};
