'use strict';

module.exports = dependencies => {
  const models = require('./db')(dependencies);
  const document = require('./document')(dependencies);
  const convertion = require('./convertion')();

  return {
    convertion,
    models,
    document
  };
};
