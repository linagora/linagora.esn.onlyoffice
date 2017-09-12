'use strict';

module.exports = dependencies => {

  const mongoose = dependencies('db').mongo.mongoose;
  const documentModel = mongoose.model('document');
  const CONSTANTS = require('./constants');

  return {
    UpdateOrCreate,
    getDocumentsByUserID,
    remove
  };

  function UpdateOrCreate(usersID, documentID) {
    return documentModel.findOneAndUpdate({ document: documentID }, { $set: { document: documentID }, $push: { users: { $each: usersID } } }, { new: true, upsert: true })
      .populate('document').exec();
  }

  function getDocumentsByUserID(userID, options = {}) {
    return documentModel.aggregate([
      { $match: { users: userID } },
      {
        $lookup: {
          from: 'fs.files', localField: 'document', foreignField: '_id', as: 'documents2'
        }
      },
      {
        $project: {
          _id: 1, users: 1, document: { $arrayElemAt: ['$documents2', 0] }
        }
      },
      { $sort: { 'document.uploadDate': -1 } },
      { $skip: +options.offset || CONSTANTS.DEFAULT_OFFSET },
      { $limit: +options.limit || CONSTANTS.DEFAULT_LIMIT },
      {
        $group: {
          _id: userID,
          documents: { $push: '$document' }
        }
      }
    ]).exec();
  }

  function remove(documentID) {
    return documentModel.remove({ document: documentID }).exec();
  }
};
