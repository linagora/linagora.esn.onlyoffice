'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const ObjectId = mongoose.Schema.Types.ObjectId;

  mongoose.model('GFS', new mongoose.Schema({}, { strict: false }), 'fs.files');

  const documentSchema = new mongoose.Schema({
    users: [{ type: ObjectId, ref: 'User', unique: false }],
    document: { type: ObjectId, ref: 'GFS' }
  });

  return mongoose.model('document', documentSchema);
};
