'use strict';

module.exports = function(dependencies) {
  const models = require('./db')(dependencies);
  const document = require('./document')(dependencies);
  const convertion = require('./convertion')(dependencies);

  return {
    convertion,
    models,
    document
  }
};
