'use strict';

module.exports = function(dependencies) {

  const document = require('./document')(dependencies);

  return {
    document
  };
};
