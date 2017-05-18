'use strict';

module.exports = function(dependencies) {

  const mongoose = dependencies('db').mongo.mongoose;
  const documentModel = mongoose.model('document');

  function UpdateOrCreate(usersID, documentID, callback) {
    return documentModel.findOneAndUpdate({document: documentID}, {$set: {document: documentID}, $push: {users: { $each: usersID}}}, {new: true, upsert: true})
      .populate('document').exec(callback);
  }

  function getDocumentsByUserID(userID, callback) {
    return documentModel.aggregate({$match: {users: userID}})
      .group({
        _id: userID,
        coAuthor: {$addToSet: '$users'},
        documents: {$push: '$document'}
      })
      .lookup({
        from: 'fs.files',
        localField: 'documents',
        foreignField: '_id',
        as: 'documents'
      })
      .unwind('$documents')
      .lookup({
        from: 'users',
        localField: 'documents.metadata.creator.id',
        foreignField: '_id',
        as: 'documents.metadata.creator'
      })
      .project('-documents.metadata.creator.password -documents.metadata.creator.accounts')
      .group({
        _id: userID,
        documents: {$push: '$documents'}
      })
      .exec(callback);
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
